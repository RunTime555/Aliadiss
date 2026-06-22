import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CustomerDashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [myStore, orderCount, publicProducts] = await Promise.all([
    prisma.store.findUnique({
      where: { ownerId: session.userId },
      include: { _count: { select: { products: true, sales: true } } },
    }),
    prisma.order.count({ where: { customerId: session.userId } }),
    prisma.product.findMany({
      where: { status: "VERIFIED", store: { status: "APPROVED" } },
      include: { store: { select: { name: true } } },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const storeColor =
    myStore?.status === "APPROVED"
      ? { bg: "#DCFCE7", color: "#15803D", text: "Approved" }
      : myStore?.status === "REJECTED"
        ? { bg: "#FEE2E2", color: "#DC2626", text: "Rejected" }
        : myStore
          ? { bg: "#FEF3C7", color: "#B45309", text: "Pending review" }
          : null;

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#1A1A1A",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            marginBottom: 4,
          }}
        >
          Welcome back, {session.name.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "#9B9B9B", fontSize: 14 }}>
          Here&apos;s what&apos;s going on with your account.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          { label: "My Orders", value: orderCount, icon: "📦", href: "/customer/orders" },
          { label: "Store Products", value: myStore?._count.products ?? 0, icon: "🏪", href: "/customer/store" },
          { label: "Total Sales", value: myStore?._count.sales ?? 0, icon: "💰", href: "/customer/store" },
        ].map((s) => (
          <Link href={s.href} key={s.label} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #E8E8E8",
                borderRadius: 14,
                padding: "20px 22px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "border-color 0.15s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderColor = "#F57C00")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.borderColor = "#E8E8E8")
              }
            >
              <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Store status banner */}
      {myStore ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #E8E8E8",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#FFF7ED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              🏪
            </div>
            <div>
              <div
                style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}
              >
                {myStore.name}
              </div>
              <div style={{ fontSize: 13, color: "#9B9B9B", marginTop: 2 }}>
                {myStore.city} · {myStore._count.products} products
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {storeColor && (
              <span
                style={{
                  background: storeColor.bg,
                  color: storeColor.color,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 99,
                }}
              >
                {storeColor.text}
              </span>
            )}
            <Link
              href="/customer/store"
              style={{
                background: "#F57C00",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              Manage store →
            </Link>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              Start selling on AliAddiss
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
              Set up your store, list products, and earn. Admin will verify
              your credentials.
            </div>
          </div>
          <Link
            href="/customer/store"
            style={{
              background: "#F57C00",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              padding: "10px 20px",
              borderRadius: 10,
              flexShrink: 0,
            }}
          >
            Open a store →
          </Link>
        </div>
      )}

      {/* Latest products */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#1A1A1A",
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}
          >
            New in Marketplace
          </h2>
          <Link
            href="/market"
            style={{ fontSize: 13, fontWeight: 600, color: "#F57C00" }}
          >
            Browse all →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {publicProducts.map((p) => (
            <Link
              href={`/market/${p.id}`}
              key={p.id}
              style={{
                background: "#fff",
                border: "1px solid #E8E8E8",
                borderRadius: 12,
                overflow: "hidden",
                textDecoration: "none",
                display: "block",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  height: 100,
                  background: "linear-gradient(135deg,#FFF7ED,#FFEDD5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                }}
              >
                {p.imageEmoji}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1A1A1A",
                    marginBottom: 4,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#F57C00",
                  }}
                >
                  {p.priceBirr.toLocaleString()} ETB
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
