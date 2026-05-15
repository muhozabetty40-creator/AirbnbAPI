import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing NULL fields in database...");

  // Get all listings
  const listings = await prisma.listing.findMany();
  console.log(`Found ${listings.length} listings to check`);

  let updated = 0;

  for (const listing of listings) {
    let needsUpdate = false;
    const updateData: any = {};

    // Fix NULL image
    if (!listing.image) {
      updateData.image = `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop&id=${listing.id}`;
      needsUpdate = true;
      console.log(`  ✓ Adding image to: ${listing.title}`);
    }

    // Fix NULL bedrooms
    if (listing.bedrooms === null) {
      updateData.bedrooms = Math.floor(Math.random() * 4) + 1; // 1-4 bedrooms
      needsUpdate = true;
      console.log(`  ✓ Adding bedrooms (${updateData.bedrooms}) to: ${listing.title}`);
    }

    // Fix NULL bathrooms
    if (listing.bathrooms === null) {
      updateData.bathrooms = Math.floor(Math.random() * 3) + 1; // 1-3 bathrooms
      needsUpdate = true;
      console.log(`  ✓ Adding bathrooms (${updateData.bathrooms}) to: ${listing.title}`);
    }

    // Fix NULL rating
    if (listing.rating === null) {
      updateData.rating = parseFloat((Math.random() * 0.4 + 4.5).toFixed(1)); // 4.5-4.9
      needsUpdate = true;
      console.log(`  ✓ Adding rating (${updateData.rating}) to: ${listing.title}`);
    }

    // Fix NULL amenities
    if (!listing.amenities || listing.amenities.length === 0) {
      const amenitiesOptions = [
        ["WiFi", "Kitchen", "Air Conditioning"],
        ["WiFi", "Parking", "Washer"],
        ["Pool", "Hot Tub", "WiFi"],
        ["Fireplace", "WiFi", "Kitchen"],
        ["Beach Access", "Pool", "WiFi"],
        ["Gym", "Rooftop", "WiFi"],
        ["Mountain Views", "Fireplace", "WiFi"],
        ["Garden", "Parking", "WiFi"],
        ["Deck", "WiFi", "Kitchen"],
        ["WiFi", "Kitchen", "Parking"]
      ];
      updateData.amenities = amenitiesOptions[Math.floor(Math.random() * amenitiesOptions.length)];
      needsUpdate = true;
      console.log(`  ✓ Adding amenities to: ${listing.title}`);
    }

    if (needsUpdate) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: updateData
      });
      updated++;
    }
  }

  console.log(`\n✅ Fixed ${updated} listings`);

  // Get updated listings to show summary
  const updatedListings = await prisma.listing.findMany();
  console.log("\n📊 Updated Listings Summary:");
  updatedListings.forEach((listing, idx) => {
    console.log(`\n${idx + 1}. ${listing.title}`);
    console.log(`   Location: ${listing.location}`);
    console.log(`   Price: $${listing.pricePerNight}/night`);
    console.log(`   Beds: ${listing.bedrooms} | Baths: ${listing.bathrooms} | Guests: ${listing.guests}`);
    console.log(`   Rating: ${listing.rating}⭐`);
    console.log(`   Amenities: ${listing.amenities.join(", ")}`);
    console.log(`   Image: ${listing.image ? "✓" : "✗"}`);
  });

  console.log("\n✅ All NULL fields have been fixed!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
