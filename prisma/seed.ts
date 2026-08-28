import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Category
  const category = await prisma.category.upsert({
    where: { slug: "vegetables" },
    update: {},
    create: { name: "Vegetables", slug: "vegetables", description: "Fresh farm vegetables" },
  });

  // Bell pepper product
  const price = new Prisma.Decimal(1500);
  const existingProduct = await prisma.product.findFirst({ where: { slug: "fresh-bell-pepper" } });
  if (!existingProduct) {
    const product = await prisma.product.create({
      data: {
        name: "Fresh Bell Pepper",
        slug: "fresh-bell-pepper",
        categoryId: category.id,
        description:
          "Fresh bell peppers carefully cultivated and harvested at Eshcol Harvest Hub in Jos, Plateau State. Crisp, colourful and versatile.",
        shortDescription: "Crisp, colourful bell peppers grown in Jos.",
        unit: "KILOGRAM",
        price,
        status: "IN_STOCK",
        published: true,
        featured: true,
        seasonal: false,
        lowStockThreshold: 10,
        inventory: {
          create: { availableQty: new Prisma.Decimal(500), lowStockThreshold: 10 },
        },
        images: {
          create: { url: "/placeholder-product.svg", alt: "Fresh Bell Pepper", position: 0 },
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@eshcolharvesthub.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "EshcolAdmin123!";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "Farm Admin",
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  }

  // Blog category + sample post
  const blogCat = await prisma.blogCategory.upsert({
    where: { slug: "farm-stories" },
    update: {},
    create: { name: "Farm Stories", slug: "farm-stories" },
  });
  const postExists = await prisma.blogPost.findFirst({ where: { slug: "seed-to-harvest-bell-peppers" } });
  if (!postExists) {
    await prisma.blogPost.create({
      data: {
        title: "From Seed to Harvest: Our Bell Peppers",
        slug: "seed-to-harvest-bell-peppers",
        excerpt: "A look at how we grow our bell peppers from planting to harvest.",
        content:
          "<p>At Eshcol Harvest Hub, every bell pepper begins as a carefully selected seed...</p>",
        status: "PUBLISHED",
        publishedAt: new Date(),
        categoryId: blogCat.id,
        featuredImage: "/placeholder-post.svg",
      },
    });
    console.log("Created sample journal post.");
  }

  // Delivery zone: farm pickup is free by rule; add a default Jos zone.
  const zoneExists = await prisma.deliveryZone.findFirst({ where: { name: "Jos Zone 1" } });
  if (!zoneExists) {
    await prisma.deliveryZone.create({
      data: { name: "Jos Zone 1", area: "Jos", state: "Plateau", fee: new Prisma.Decimal(1500), active: true, position: 1 },
    });
    console.log("Created delivery zone: Jos Zone 1 (₦1500).");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
