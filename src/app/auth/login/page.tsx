"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoFull } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    if (data.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/customer/dashboard");
    }
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9F9F9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/">
          <LogoFull />
        </Link>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E8E8",
          borderRadius: 20,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#1A1A1A",
            marginBottom: 6,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          Welcome back
        </h1>
        <p style={{ color: "#9B9B9B", fontSize: 14, marginBottom: 28 }}>
          Sign in to your AliAddiss account
        </p>

        {/* Demo accounts */}
        <div
          style={{
            background: "#FFF7ED",
            border: "1px solid #FED7AA",
            borderRadius: 10,
            padding: "12px 14px",
            marginBottom: 24,
            fontSize: 12,
            color: "#92400E",
            lineHeight: 1.7,
          }}
        >
          <strong>Demo accounts:</strong>
          <br />
          Admin: admin@aliadiss.com / admin123
          <br />
          Customer: customer@aliadiss.com / customer123
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: error ? "1.5px solid #DC2626" : "1.5px solid #E8E8E8",
                fontSize: 14,
                color: "#1A1A1A",
                outline: "none",
                background: "#FAFAFA",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#F57C00")}
              onBlur={(e) =>
                (e.target.style.borderColor = error ? "#DC2626" : "#E8E8E8")
              }
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: error ? "1.5px solid #DC2626" : "1.5px solid #E8E8E8",
                fontSize: 14,
                color: "#1A1A1A",
                outline: "none",
                background: "#FAFAFA",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#F57C00")}
              onBlur={(e) =>
                (e.target.style.borderColor = error ? "#DC2626" : "#E8E8E8")
              }
            />
          </div>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 13,
                color: "#DC2626",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#D1D5DB" : "#F57C00",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              padding: "13px",
              borderRadius: 10,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ animation: "spin 0.8s linear infinite" }}
                >
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in →"
            )}
          </button>

          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "#9B9B9B", marginTop: 24 }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: "#F57C00", fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
