"use client";
import { useState } from "react";
import { FiMonitor } from "react-icons/fi";

const SERVERS = [
  {
    name: "VidFast",
    url: (id: number) => `https://vidfast.pro/movie/${id}?autoPlay=true`,
  },
  {
    name: "Videasy",
    url: (id: number) => `https://player.videasy.net/movie/${id}`,
  },
  { name: "VidLink", url: (id: number) => `https://vidlink.pro/movie/${id}` },
  {
    name: "VidSrc",
    url: (id: number) => `https://vidsrc.cc/v2/embed/movie/${id}`,
  },
];

export default function MoviePlayerClient({ movieId }: { movieId: number }) {
  const [selected, setSelected] = useState(SERVERS[0].name);
  const server = SERVERS.find((s) => s.name === selected) || SERVERS[0];

  return (
    <div>
      {/* Server tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#8888a8",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          <FiMonitor size={13} /> Server:
        </span>
        {SERVERS.map((sv) => (
          <button
            key={sv.name}
            onClick={() => setSelected(sv.name)}
            style={{
              padding: "7px 18px",
              borderRadius: 8,
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.18s",
              border: "1px solid",
              borderColor:
                selected === sv.name ? "#f5c518" : "rgba(255,255,255,0.1)",
              background:
                selected === sv.name ? "#f5c518" : "rgba(255,255,255,0.05)",
              color: selected === sv.name ? "#0a0a0f" : "#e8e8f0",
              boxShadow:
                selected === sv.name ? "0 0 14px rgba(245,197,24,.3)" : "none",
            }}
          >
            {sv.name}
          </button>
        ))}
      </div>

      {/* Player — iframe shown immediately; player handles its own loading UI */}
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 8px 48px rgba(0,0,0,.85)",
          border: "1px solid rgba(255,255,255,.07)",
          aspectRatio: "16/9",
        }}
      >
        <iframe
          key={`${selected}-${movieId}`}
          src={server.url(movieId)}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          referrerPolicy="no-referrer"
        />
      </div>
      <p
        style={{
          marginTop: 8,
          fontSize: "0.74rem",
          color: "#8888a8",
          textAlign: "center",
        }}
      >
        If the player doesn&apos;t load, try another server above.
      </p>
    </div>
  );
}
