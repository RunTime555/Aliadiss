import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const store = await prisma.store.findUnique({
    where: { ownerId: session.userId },
    include: {
      products: { orderBy: { createdAt: "desc" } },
      _count: { select: { sales: true } },
    },
  });

  return NextResponse.json(store || null);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, legalName, city, credentialsNote } = body;

  if (!name || !legalName || !city || !credentialsNote) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const existing = await prisma.store.findUnique({ where: { ownerId: session.userId } });
  if (existing) {
    const updated = await prisma.store.update({
      where: { id: existing.id },
      data: { name, description, legalName, city, credentialsNote, status: "PENDING" },
    });
    return NextResponse.json(updated);
  }

  const store = await prisma.store.create({
    data: { name, description, legalName, city, credentialsNote, ownerId: session.userId },
  });

  return NextResponse.json(store);
}
