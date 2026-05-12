import type { Request, Response } from "express";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { deterministicModel, creativeModel } from "../config/ai.js";
import prisma from "../config/prisma.js";

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// ─── In-memory storage ────────────────────────────────────────────────────────

// Store conversation histories in memory (in production, use Redis or database)
const sessionHistories = new Map<string, InMemoryChatMessageHistory>();

function getSessionHistory(sessionId: string): InMemoryChatMessageHistory {
  if (!sessionHistories.has(sessionId)) {
    sessionHistories.set(sessionId, new InMemoryChatMessageHistory());
  }
  return sessionHistories.get(sessionId)!;
}

// Simple in-memory cache for review summaries
const reviewCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCachedReviewSummary(listingId: string): unknown | null {
  const cached = reviewCache.get(listingId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  reviewCache.delete(listingId);
  return null;
}

function setCachedReviewSummary(listingId: string, data: unknown): void {
  reviewCache.set(listingId, { data, timestamp: Date.now() });
}

function clearReviewCache(listingId: string): void {
  reviewCache.delete(listingId);
}

// ─── Helper: Handle Groq errors ───────────────────────────────────────────────

function handleGroqError(error: unknown): { status: number; message: string } {
  const err = error as any;

  if (err.status === 429) {
    return {
      status: 429,
      message: "AI service is busy, please try again in a moment",
    };
  }

  if (err.status === 401) {
    return { status: 500, message: "AI service configuration error" };
  }

  if (err.message?.includes("Invalid JSON")) {
    return { status: 500, message: "Failed to parse AI response" };
  }

  return {
    status: 500,
    message: "AI service error, please try again",
  };
}

// ─── Part 1: Smart Listing Search with Pagination ─────────────────────────────

const searchPrompt = ChatPromptTemplate.fromTemplate(`
You are a search filter extraction assistant for an Airbnb-like platform.
Extract search filters from the user's natural language query.

User query: {query}

Return a JSON object with these optional fields (null if not mentioned):
- location: string or null (city or area mentioned)
- type: one of ["APARTMENT", "HOUSE", "VILLA", "CABIN"] or null (if mentioned)
- guests: number or null (max guests needed)
- maxPrice: number or null (maximum price per night in USD)

Return ONLY valid JSON. No explanation. No markdown. Example:
{{"location": "Kigali", "type": "APARTMENT", "guests": 2, "maxPrice": 100}}

If a field is not mentioned, set it to null.
`);

const searchParser = new JsonOutputParser();
const searchChain = searchPrompt.pipe(deterministicModel).pipe(searchParser);

export async function naturalLanguageSearch(req: Request, res: Response) {
  try {
    const { query } = req.body;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 10));

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "query is required and must be a string" });
    }

    // Extract filters from natural language
    const filters = (await searchChain.invoke({ query })) as {
      location: string | null;
      type: string | null;
      guests: number | null;
      maxPrice: number | null;
    };

    // Check if all filters are null — don't run empty queries
    if (!filters.location && !filters.type && !filters.guests && !filters.maxPrice) {
      return res.status(400).json({
        error: "Could not extract any filters from your query, please be more specific",
      });
    }

    // Build Prisma where clause
    const where: Record<string, unknown> = {};

    if (filters.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.guests) {
      where.guests = { gte: filters.guests };
    }
    if (filters.maxPrice) {
      where.pricePerNight = { lte: filters.maxPrice };
    }

    // Fetch listings and total count simultaneously
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.listing.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      filters,
      data: listings,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("AI search error:", error);
    const { status, message } = handleGroqError(error);
    res.status(status).json({ error: message });
  }
}

// ─── Part 2: Listing Description Generator with Tone Control ─────────────────

const descriptionPrompts = {
  professional: ChatPromptTemplate.fromTemplate(`
You are a professional copywriter for an Airbnb-like platform.
Write a formal, clear, and business-like listing description.

Listing details:
- Title: {title}
- Location: {location}
- Type: {type}
- Max guests: {guests}
- Amenities: {amenities}
- Price per night: ${"{price}"} USD
- Current description: {currentDescription}

Write a 3-paragraph professional description:
1. Opening statement — what makes this property suitable
2. The space — describe property and features formally
3. The location — what's nearby and why it's valuable

Keep it between 150-200 words. Be specific and formal.
`),
  casual: ChatPromptTemplate.fromTemplate(`
You are a friendly copywriter for an Airbnb-like platform.
Write a casual, warm, and conversational listing description.

Listing details:
- Title: {title}
- Location: {location}
- Type: {type}
- Max guests: {guests}
- Amenities: {amenities}
- Price per night: ${"{price}"} USD
- Current description: {currentDescription}

Write a 3-paragraph casual description:
1. Opening hook — what makes this place fun and special
2. The space — describe the property in a friendly way
3. The location — what guests can do nearby

Keep it between 150-200 words. Be warm and inviting.
`),
  luxury: ChatPromptTemplate.fromTemplate(`
You are a luxury marketing specialist for an Airbnb-like platform.
Write an elegant, premium, and aspirational listing description.

Listing details:
- Title: {title}
- Location: {location}
- Type: {type}
- Max guests: {guests}
- Amenities: {amenities}
- Price per night: ${"{price}"} USD
- Current description: {currentDescription}

Write a 3-paragraph luxury description:
1. Opening statement — emphasize exclusivity and prestige
2. The space — highlight premium features and finishes
3. The location — position as an exclusive destination

Keep it between 150-200 words. Use sophisticated language.
`),
};

const descriptionParser = new StringOutputParser();

export async function generateListingDescription(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { tone = "professional" } = req.body;

    // Validate tone
    if (!["professional", "casual", "luxury"].includes(tone)) {
      return res.status(400).json({
        error: "tone must be one of: professional, casual, luxury",
      });
    }

    // Fetch listing
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Check ownership
    if (listing.userId !== req.userId) {
      return res.status(403).json({ error: "You can only generate descriptions for your own listings" });
    }

    // Generate description
    const prompt = descriptionPrompts[tone as keyof typeof descriptionPrompts];
    const chain = prompt.pipe(creativeModel).pipe(descriptionParser);

    const description = await chain.invoke({
      title: listing.title,
      location: listing.location,
      type: listing.type,
      guests: listing.guests,
      amenities: Array.isArray(listing.amenities) ? listing.amenities.join(", ") : listing.amenities,
      price: listing.pricePerNight,
      currentDescription: listing.description,
    });

    // Save to database
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { description },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json({ description, listing: updatedListing });
  } catch (error) {
    console.error("Description generation error:", error);
    const { status, message } = handleGroqError(error);
    res.status(status).json({ error: message });
  }
}

// ─── Part 3: Guest Support Chatbot with Listing Context ──────────────────────

const chatPromptWithContext = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful guest support assistant for an Airbnb-like platform.
You are currently helping a guest with questions about this specific listing:

Title: {title}
Location: {location}
Price per night: ${"{price}"}
Max guests: {guests}
Type: {type}
Amenities: {amenities}
Description: {description}

Answer questions about this listing accurately based on the details above.
If asked something not covered by the listing details, say you don't have that information.
Be helpful and friendly.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

const chatPromptNoContext = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful guest support assistant for an Airbnb-like platform.
Help guests find listings, answer questions about bookings, and assist with general inquiries.
Be friendly, concise, and helpful. If you don't know something, say so.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

export async function chat(req: Request, res: Response) {
  try {
    const { message, sessionId, listingId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required and must be a string" });
    }

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "sessionId is required and must be a string" });
    }

    let chatPrompt = chatPromptNoContext;
    let listingContext: Record<string, unknown> = {};

    // If listingId provided, fetch and inject listing context
    if (listingId && typeof listingId === "string") {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { user: { select: { name: true } } },
      });

      if (listing) {
        chatPrompt = chatPromptWithContext;
        listingContext = {
          title: listing.title,
          location: listing.location,
          price: listing.pricePerNight,
          guests: listing.guests,
          type: listing.type,
          amenities: Array.isArray(listing.amenities)
            ? listing.amenities.join(", ")
            : listing.amenities,
          description: listing.description,
        };
      }
    }

    // Create chain with message history
    const chatChain = chatPrompt.pipe(creativeModel);
    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: chatChain,
      getMessageHistory: getSessionHistory,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });

    // Invoke with history
    const reply = await chainWithHistory.invoke(
      { input: message, ...listingContext },
      { configurable: { sessionId } }
    );

    // Get session history and trim if needed
    const history = getSessionHistory(sessionId);
    const messages = await history.getMessages();

    // Keep only last 10 exchanges (20 messages)
    if (messages.length > 20) {
      // Clear and rebuild with only last 10 exchanges
      const newMessages = messages.slice(-20);
      sessionHistories.delete(sessionId);
      const newHistory = new InMemoryChatMessageHistory();
      for (const msg of newMessages) {
        if (msg._getType() === "human") {
          await newHistory.addUserMessage(msg.content);
        } else {
          await newHistory.addAiMessage(msg.content);
        }
      }
      sessionHistories.set(sessionId, newHistory);
    }

    res.json({
      response: reply.content,
      sessionId,
      messageCount: messages.length,
    });
  } catch (error) {
    console.error("Chat error:", error);
    const { status, message } = handleGroqError(error);
    res.status(status).json({ error: message });
  }
}

// ─── Part 4: AI Booking Recommendation ────────────────────────────────────────

const recommendationPrompt = ChatPromptTemplate.fromTemplate(`
Analyze this user's booking history and recommend search filters for similar listings.

User's booking history:
{bookingHistory}

Based on this history, extract the user's preferences and suggest search filters in JSON format:
{{"preferences": "description of what user likes", "searchFilters": {{"location": "string or null", "type": "string or null", "maxPrice": "number or null", "guests": "number or null"}}, "reason": "why these filters were chosen"}}

Return ONLY valid JSON. No explanation.
`);

const recommendationParser = new JsonOutputParser();
const recommendationChain = recommendationPrompt
  .pipe(deterministicModel)
  .pipe(recommendationParser);

export async function recommendListings(req: Request, res: Response) {
  try {
    // Fetch user's last 5 bookings
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId },
      include: {
        listing: {
          select: {
            title: true,
            location: true,
            type: true,
            pricePerNight: true,
            guests: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    if (bookings.length === 0) {
      return res.status(400).json({
        error: "No booking history found. Make some bookings first to get recommendations.",
      });
    }

    // Format booking history for AI
    const bookingHistory = bookings
      .map(
        (b, i) =>
          `${i + 1}. ${b.listing.title} in ${b.listing.location} (${b.listing.type}) - $${b.listing.pricePerNight}/night, ${b.listing.guests} guests`
      )
      .join("\n");

    // Get AI recommendation
    const recommendation = (await recommendationChain.invoke({
      bookingHistory,
    })) as {
      preferences: string;
      searchFilters: { location?: string; type?: string; maxPrice?: number; guests?: number };
      reason: string;
    };

    // Build Prisma query from recommended filters
    const where: Record<string, unknown> = {};
    const bookedListingIds = bookings.map((b) => b.listing);

    if (recommendation.searchFilters?.location) {
      where.location = { contains: recommendation.searchFilters.location, mode: "insensitive" };
    }
    if (recommendation.searchFilters?.type) {
      where.type = recommendation.searchFilters.type;
    }
    if (recommendation.searchFilters?.maxPrice) {
      where.pricePerNight = { lte: recommendation.searchFilters.maxPrice };
    }
    if (recommendation.searchFilters?.guests) {
      where.guests = { gte: recommendation.searchFilters.guests };
    }

    // Exclude already-booked listings
    where.id = { notIn: bookings.map((b) => b.listingId) };

    // Fetch recommended listings
    const recommendations = await prisma.listing.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      take: 5,
      orderBy: { rating: "desc" },
    });

    res.json({
      preferences: recommendation.preferences,
      reason: recommendation.reason,
      searchFilters: recommendation.searchFilters,
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    const { status, message } = handleGroqError(error);
    res.status(status).json({ error: message });
  }
}

// ─── Part 5: Listing Review Summarizer ────────────────────────────────────────

const reviewSummaryPrompt = ChatPromptTemplate.fromTemplate(`
Summarize these guest reviews for a listing. Provide a JSON response:

Reviews:
{reviews}

Return JSON with this structure:
{{"summary": "2-3 sentence overall summary", "positives": ["thing1", "thing2", "thing3"], "negatives": ["thing1", "thing2"] or []}}

Focus on what guests consistently praised and complained about. Return ONLY valid JSON.
`);

const reviewSummaryParser = new JsonOutputParser();
const reviewSummaryChain = reviewSummaryPrompt.pipe(creativeModel).pipe(reviewSummaryParser);

export async function reviewSummary(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check cache first
    const cached = getCachedReviewSummary(id);
    if (cached) {
      return res.json(cached);
    }

    // Fetch listing
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Fetch reviews
    const reviews = await prisma.review.findMany({
      where: { listingId: id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Check minimum reviews
    if (reviews.length < 3) {
      return res.status(400).json({
        error: "Not enough reviews to generate a summary (minimum 3 required)",
      });
    }

    // Format reviews for AI
    const reviewsText = reviews
      .map((r) => `${r.user.name} (${r.rating}★): ${r.comment}`)
      .join("\n");

    // Get AI summary
    const aiSummary = (await reviewSummaryChain.invoke({
      reviews: reviewsText,
    })) as {
      summary: string;
      positives: string[];
      negatives: string[];
    };

    // Calculate average rating
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const result = {
      summary: aiSummary.summary,
      positives: aiSummary.positives || [],
      negatives: aiSummary.negatives || [],
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    };

    // Cache the result
    setCachedReviewSummary(id, result);

    res.json(result);
  } catch (error) {
    console.error("Review summary error:", error);
    const { status, message } = handleGroqError(error);
    res.status(status).json({ error: message });
  }
}

// Export cache clear function for use in reviews controller
export function clearReviewSummaryCache(listingId: string): void {
  clearReviewCache(listingId);
}
