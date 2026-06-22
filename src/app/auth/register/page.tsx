"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoFull } from "@/components/logo";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/customer/dashboard");
    router.refresh();
  }

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 10,
          border: "1.5px solid #E8E8E8",
          fontSize: 14,
          color: "#1A1A1A",
          outline: "none",
          background: "#FAFAFA",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#F57C00")}
        onBlur={(e) => (e.target.style.borderColor = "#E8E8E8")}
      />
    </div>
  );

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
      <div style={{ marginBottom: 32 }}>
        <Link href="/"><LogoFull /></Link>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E8E8",
          borderRadius: 20,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", marginBottom: 6, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
          Create your account
        </h1>
        <p style={{ color: "#9B9B9B", fontSize: 14, marginBottom: 28 }}>
          Join AliAddiss — Ethiopia&apos;s verified tech marketplace
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {field("name", "Full name", "text", "Abebe Girma")}
          {field("email", "Email address", "email", "you@example.com")}
          {field("password", "Password", "password", "At least 8 characters")}
          {field("confirm", "Confirm password", "password", "Repeat your password")}

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#DC2626" }}>
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
              marginTop: 4,
            }}
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "#9B9B9B", marginTop: 24 }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#F57C00", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
