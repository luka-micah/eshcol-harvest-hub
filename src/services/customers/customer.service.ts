import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export async function registerCustomer(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  customerType?: "HOUSEHOLD" | "RETAILER" | "OFFTAKER" | "OTHER";
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });
  if (existing) throw new Error("An account with this email already exists");

  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: "CUSTOMER",
      customerProfile: {
        create: {
          customerType: (data.customerType ?? "HOUSEHOLD") as any,
          phone: data.phone,
        },
      },
    },
    include: { customerProfile: true },
  });
}

export async function listCustomers() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      customerProfile: true,
      orders: { select: { total: true, createdAt: true } },
      addresses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return customers.map((c) => {
    const totals = c.orders.reduce((sum, o) => sum.plus(o.total), new Prisma.Decimal(0));
    const lastOrder = c.orders[0]?.createdAt ?? null;
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.customerProfile?.phone ?? null,
      customerType: c.customerProfile?.customerType ?? "HOUSEHOLD",
      companyName: c.customerProfile?.companyName ?? null,
      totalSpent: totals.toNumber(),
      orderCount: c.orders.length,
      lastOrder,
      addresses: c.addresses,
    };
  });
}
