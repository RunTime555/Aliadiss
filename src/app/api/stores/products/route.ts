import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const store = await prisma.store.findUnique({ where: { ownerId: session.userId } });
  if (!store || store.status !== "APPROVED") {
    return NextResponse.json({ error: "Your store must be approved first" }, { status: 403 });
  }

  const body = await req.json();
  const {
    title, description, category, condition, priceBirr,
    warrantyType, warrantyMonths, imageEmoji,
    screenSizeIn, screenResolution, cameraMp, ramGb, processorType, batteryMah,
  } = body;

  if (!title || !category || !priceBirr) {
    return NextResponse.json({ error: "Title, category, and price are required" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      title, description, category, condition: condition || "New",
      priceBirr: Number(priceBirr),
      warrantyType: warrantyType || "NONE",
      warrantyMonths: Number(warrantyMonths) || 0,
      imageEmoji: imageEmoji || "📦",
      screenSizeIn, screenResolution, cameraMp, ramGb, processorType, batteryMah,
      storeId: store.id,
      status: "PENDING",
    },
  });

  return NextResponse.json(product);
}
