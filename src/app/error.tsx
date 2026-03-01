"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";

const ErrorPage = ({ error }: { error: Error }) => {
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
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255,77,109,0.1)",
          border: "2px solid rgba(255,77,109,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MdErrorOutline size={36} color="#ff6b87" />
      </div>
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
        }}
      >
        Oops! Something Went Wrong
      </h1>
      <p
        style={{
          color: "#8888a8",
          fontSize: "0.9rem",
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 1.6,
        }}
      >
        We couldn&apos;t process your request. This might be a temporary issue.
      </p>
      {error?.message && (
        <p
          style={{
            color: "#ff6b87",
            fontSize: "0.78rem",
            background: "rgba(255,77,109,0.08)",
            border: "1px solid rgba(255,77,109,0.2)",
            borderRadius: 8,
            padding: "8px 16px",
            maxWidth: 420,
            textAlign: "center",
          }}
        >
          {error.message}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            padding: "10px 24px",
            borderRadius: 99,
            background: "rgba(255,255,255,0.08)",
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
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
