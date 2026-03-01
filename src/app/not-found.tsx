"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MdOutlineSearchOff } from "react-icons/md";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--clr-bg)",
        gap: 16,
        padding: "24px",
        paddingTop: 100,
      }}
    >
      {/* Big 404 text */}
      <div
        style={{
          fontSize: "clamp(6rem, 15vw, 10rem)",
          fontWeight: 900,
          lineHeight: 1,
          background:
            "linear-gradient(135deg, rgba(245,197,24,0.4), rgba(245,197,24,0.08))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.03em",
          userSelect: "none",
        }}
      >
        404
      </div>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(245,197,24,0.08)",
          border: "2px solid rgba(245,197,24,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -8,
        }}
      >
        <MdOutlineSearchOff size={30} color="#f5c518" />
      </div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          color: "#8888a8",
          fontSize: "0.9rem",
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.6,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            padding: "10px 24px",
            borderRadius: 99,
            background: "rgba(255,255,255,0.07)",
            color: "#e8e8f0",
            border: "1px solid rgba(255,255,255,0.12)",
            fontWeight: 600,
            fontSize: "0.88rem",
            cursor: "pointer",
          }}
        >
          ← Go Back
        </button>
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "10px 24px",
            borderRadius: 99,
            background: "linear-gradient(135deg, #f5c518, #e8a800)",
            color: "#0a0a0f",
            border: "none",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(245,197,24,0.35)",
          }}
        >
          🏠 Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
