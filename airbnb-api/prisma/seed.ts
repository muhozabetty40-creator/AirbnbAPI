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

  const apartment = await prisma.listing.create({
    data: {
      title: "Urban Apartment",
      description: "A bright apartment in the heart of the city.",
      location: "New York",
      pricePerNight: 180,
      guests: 3,
      type: "APARTMENT",
      amenities: ["wifi", "air conditioning", "kitchen"],
      rating: 4.7,
      userId: alice.id
    }
  });

  const familyHouse = await prisma.listing.create({
    data: {
      title: "Family House",
      description: "A spacious house near parks and shopping.",
      location: "Austin",
      pricePerNight: 220,
      guests: 5,
      type: "HOUSE",
      amenities: ["washer", "parking", "fireplace"],
      rating: 4.8,
      userId: bob.id
    }
  });

  const lakeVilla = await prisma.listing.create({
    data: {
      title: "Lake Villa",
      description: "A luxury villa with private lake access.",
      location: "Lake Tahoe",
      pricePerNight: 420,
      guests: 8,
      type: "VILLA",
      amenities: ["pool", "hot tub", "private dock"],
      rating: 4.9,
      userId: alice.id
    }
  });

  await prisma.listing.create({
    data: {
      title: "Forest Cabin",
      description: "A cozy cabin surrounded by tall pines.",
      location: "Asheville",
      pricePerNight: 150,
      guests: 4,
      type: "CABIN",
      amenities: ["fireplace", "hiking trails", "wifi"],
      rating: 4.6,
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
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
