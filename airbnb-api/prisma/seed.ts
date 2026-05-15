import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "alice@example.com",
      username: "alice_host",
      phone: "+1-415-555-0100",
      role: "HOST",
      avatar: "https://example.com/avatars/alice.jpg"
    }
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob Williams",
      email: "bob@example.com",
      username: "bob_host",
      phone: "+1-206-555-0144",
      role: "HOST",
      avatar: "https://example.com/avatars/bob.jpg"
    }
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@example.com" },
    update: {},
    create: {
      name: "Charlie Reed",
      email: "charlie@example.com",
      username: "charlie_guest",
      phone: "+1-312-555-0166",
      role: "guest"
    }
  });

  const dana = await prisma.user.upsert({
    where: { email: "dana@example.com" },
    update: {},
    create: {
      name: "Dana Lee",
      email: "dana@example.com",
      username: "dana_guest",
      phone: "+1-415-555-0177",
      role: "guest"
    }
  });

  const ethan = await prisma.user.upsert({
    where: { email: "ethan@example.com" },
    update: {},
    create: {
      name: "Ethan Miller",
      email: "ethan@example.com",
      username: "ethan_guest",
      phone: "+1-212-555-0188",
      role: "guest"
    }
  });

  // Listings with images
  const apartment = await prisma.listing.create({
    data: {
      title: "Luxury Downtown Apartment",
      description: "A bright and modern apartment in the heart of the city with stunning skyline views. Perfect for business travelers and couples.",
      location: "New York, NY",
      pricePerNight: 180,
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      type: "APARTMENT",
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "Washer", "Dryer"],
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop",
      rating: 4.7,
      userId: alice.id
    }
  });

  const familyHouse = await prisma.listing.create({
    data: {
      title: "Spacious Family House",
      description: "A beautiful family home near parks and shopping centers. Great for families with children and pets welcome.",
      location: "Austin, TX",
      pricePerNight: 220,
      guests: 5,
      bedrooms: 3,
      bathrooms: 2,
      type: "HOUSE",
      amenities: ["Washer", "Parking", "Fireplace", "Backyard", "BBQ Grill"],
      image: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400&fit=crop",
      rating: 4.8,
      userId: bob.id
    }
  });

  const lakeVilla = await prisma.listing.create({
    data: {
      title: "Luxury Lake Villa",
      description: "An exclusive luxury villa with private lake access, stunning views, and premium amenities. Perfect for a luxurious getaway.",
      location: "Lake Tahoe, CA",
      pricePerNight: 420,
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      type: "VILLA",
      amenities: ["Pool", "Hot Tub", "Private Dock", "Sauna", "Wine Cellar"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
      rating: 4.9,
      userId: alice.id
    }
  });

  const forestCabin = await prisma.listing.create({
    data: {
      title: "Cozy Forest Cabin",
      description: "A charming cabin surrounded by tall pines and nature. Perfect for a peaceful retreat with hiking trails nearby.",
      location: "Asheville, NC",
      pricePerNight: 150,
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      type: "CABIN",
      amenities: ["Fireplace", "Hiking Trails", "WiFi", "Kitchen", "Porch"],
      image: "https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=500&h=400&fit=crop",
      rating: 4.6,
      userId: bob.id
    }
  });

  const beachHouse = await prisma.listing.create({
    data: {
      title: "Beachfront Paradise",
      description: "Beautiful beachfront house with direct beach access, ocean views, and modern amenities. Perfect for beach lovers.",
      location: "Miami, FL",
      pricePerNight: 280,
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      type: "HOUSE",
      amenities: ["Beach Access", "Pool", "Deck", "Kitchen", "WiFi"],
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop",
      rating: 4.8,
      userId: alice.id
    }
  });

  const modernLoft = await prisma.listing.create({
    data: {
      title: "Modern Urban Loft",
      description: "A stylish modern loft in the trendy downtown area with exposed brick and high ceilings. Great for young professionals.",
      location: "Los Angeles, CA",
      pricePerNight: 200,
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      type: "APARTMENT",
      amenities: ["WiFi", "Gym", "Rooftop", "Parking", "Air Conditioning"],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop",
      rating: 4.7,
      userId: bob.id
    }
  });

  const mountainVilla = await prisma.listing.create({
    data: {
      title: "Mountain Retreat Villa",
      description: "Stunning mountain villa with panoramic views, perfect for nature lovers and adventure seekers.",
      location: "Denver, CO",
      pricePerNight: 350,
      guests: 7,
      bedrooms: 4,
      bathrooms: 2,
      type: "VILLA",
      amenities: ["Mountain Views", "Fireplace", "Hot Tub", "Deck", "WiFi"],
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop",
      rating: 4.9,
      userId: alice.id
    }
  });

  const cityApartment = await prisma.listing.create({
    data: {
      title: "Charming City Apartment",
      description: "A cozy apartment in the heart of the city with easy access to restaurants, shops, and attractions.",
      location: "San Francisco, CA",
      pricePerNight: 190,
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      type: "APARTMENT",
      amenities: ["WiFi", "Kitchen", "Washer", "Air Conditioning", "Balcony"],
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop",
      rating: 4.6,
      userId: bob.id
    }
  });

  const historicHouse = await prisma.listing.create({
    data: {
      title: "Historic Victorian House",
      description: "A beautifully restored Victorian house with original charm and modern amenities. Perfect for history enthusiasts.",
      location: "Boston, MA",
      pricePerNight: 240,
      guests: 4,
      bedrooms: 3,
      bathrooms: 2,
      type: "HOUSE",
      amenities: ["Fireplace", "Garden", "Parking", "WiFi", "Kitchen"],
      image: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400&fit=crop",
      rating: 4.7,
      userId: alice.id
    }
  });

  const tropicalCabin = await prisma.listing.create({
    data: {
      title: "Tropical Island Cabin",
      description: "A secluded tropical cabin on a private island with pristine beaches and crystal clear waters.",
      location: "Hawaii, HI",
      pricePerNight: 380,
      guests: 5,
      bedrooms: 2,
      bathrooms: 2,
      type: "CABIN",
      amenities: ["Beach Access", "Pool", "WiFi", "Kitchen", "Deck"],
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=400&fit=crop",
      rating: 4.9,
      userId: bob.id
    }
  });

  const now = new Date();

  const checkInA = new Date(now); checkInA.setDate(checkInA.getDate() + 10);
  const checkOutA = new Date(checkInA); checkOutA.setDate(checkOutA.getDate() + 4);

  const checkInB = new Date(now); checkInB.setDate(checkInB.getDate() + 15);
  const checkOutB = new Date(checkInB); checkOutB.setDate(checkOutB.getDate() + 3);

  const checkInC = new Date(now); checkInC.setDate(checkInC.getDate() + 20);
  const checkOutC = new Date(checkInC); checkOutC.setDate(checkOutC.getDate() + 2);

  await prisma.booking.create({
    data: {
      userId: charlie.id,
      listingId: apartment.id,
      checkIn: checkInA,
      checkOut: checkOutA,
      guests: 2,
      total: ((checkOutA.getTime() - checkInA.getTime()) / (1000 * 60 * 60 * 24)) * apartment.pricePerNight,
      status: "confirmed"
    }
  });

  await prisma.booking.create({
    data: {
      userId: dana.id,
      listingId: familyHouse.id,
      checkIn: checkInB,
      checkOut: checkOutB,
      guests: 3,
      total: ((checkOutB.getTime() - checkInB.getTime()) / (1000 * 60 * 60 * 24)) * familyHouse.pricePerNight,
      status: "confirmed"
    }
  });

  await prisma.booking.create({
    data: {
      userId: ethan.id,
      listingId: lakeVilla.id,
      checkIn: checkInC,
      checkOut: checkOutC,
      guests: 4,
      total: ((checkOutC.getTime() - checkInC.getTime()) / (1000 * 60 * 60 * 24)) * lakeVilla.pricePerNight,
      status: "confirmed"
    }
  });

  console.log("✅ Seeding complete!");
  console.log("📊 Created:");
  console.log(`   - 5 users (2 hosts, 3 guests)`);
  console.log(`   - 10 listings with images`);
  console.log(`   - 3 bookings`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
