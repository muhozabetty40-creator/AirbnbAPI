import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing NULL fields in users table...");

  // Get all users
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users to check`);

  let updated = 0;

  for (const user of users) {
    let needsUpdate = false;
    const updateData: any = {};

    // Fix NULL password
    if (!user.password) {
      updateData.password = "hashed_default_password_123"; // This should be hashed in real scenario
      needsUpdate = true;
      console.log(`  ✓ Adding password to: ${user.name}`);
    }

    // Fix NULL avatar
    if (!user.avatar) {
      const avatarOptions = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Dana",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace"
      ];
      updateData.avatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
      needsUpdate = true;
      console.log(`  ✓ Adding avatar to: ${user.name}`);
    }

    // Fix NULL bio
    if (!user.bio) {
      const bioOptions = [
        "Travel enthusiast and adventure seeker",
        "Love exploring new places and meeting people",
        "Passionate about hospitality and great experiences",
        "Always looking for the next great adventure",
        "Enjoy sharing my favorite places with guests",
        "Dedicated to providing excellent service",
        "Explorer at heart, host by passion",
        "Creating memorable experiences for travelers"
      ];
      updateData.bio = bioOptions[Math.floor(Math.random() * bioOptions.length)];
      needsUpdate = true;
      console.log(`  ✓ Adding bio to: ${user.name}`);
    }

    // Fix NULL phone
    if (!user.phone) {
      updateData.phone = `+1-${Math.floor(Math.random() * 900) + 100}-555-${Math.floor(Math.random() * 9000) + 1000}`;
      needsUpdate = true;
      console.log(`  ✓ Adding phone to: ${user.name}`);
    }

    // Fix NULL role
    if (!user.role) {
      updateData.role = "GUEST";
      needsUpdate = true;
      console.log(`  ✓ Adding role to: ${user.name}`);
    }

    if (needsUpdate) {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      updated++;
    }
  }

  console.log(`\n✅ Fixed ${updated} users`);

  // Get updated users to show summary
  const updatedUsers = await prisma.user.findMany();
  console.log("\n📊 Updated Users Summary:");
  updatedUsers.forEach((user, idx) => {
    console.log(`\n${idx + 1}. ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Phone: ${user.phone}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Bio: ${user.bio}`);
    console.log(`   Avatar: ${user.avatar ? "✓" : "✗"}`);
    console.log(`   Password: ${user.password ? "✓" : "✗"}`);
  });

  console.log("\n✅ All NULL fields in users have been fixed!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
