export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--clr-bg)",
        paddingTop: 68,
        overflowX: "hidden",
      }}
    >
      {/* Hero skeleton */}
      <div
        className="skeleton"
        style={{
          width: "100%",
          height: "clamp(280px, 70vh, 680px)",
          borderRadius: 0,
          marginBottom: 40,
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px 60px" }}>
        {/* Section header skeleton */}
        <div style={{ marginBottom: 20 }}>
          <div
            className="skeleton"
            style={{ width: 220, height: 24, borderRadius: 8, marginBottom: 8 }}
          />
          <div
            className="skeleton"
            style={{ width: 160, height: 14, borderRadius: 6 }}
          />
        </div>

        {/* Card grid skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 14,
            marginBottom: 48,
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: "hidden" }}>
              <div
                className="skeleton"
                style={{ width: "100%", aspectRatio: "2/3", borderRadius: 0 }}
              />
              <div
                style={{
                  padding: "8px 10px",
                  background: "var(--clr-surface)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  className="skeleton"
                  style={{ width: "40%", height: 10, borderRadius: 4 }}
                />
                <div
                  className="skeleton"
                  style={{ width: "90%", height: 13, borderRadius: 4 }}
                />
                <div
                  className="skeleton"
                  style={{ width: "60%", height: 10, borderRadius: 4 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Second section */}
        <div style={{ marginBottom: 20 }}>
          <div
            className="skeleton"
            style={{ width: 200, height: 24, borderRadius: 8, marginBottom: 8 }}
          />
          <div
            className="skeleton"
            style={{ width: 140, height: 14, borderRadius: 6 }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 14,
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: "hidden" }}>
              <div
                className="skeleton"
                style={{ width: "100%", aspectRatio: "2/3", borderRadius: 0 }}
              />
              <div
                style={{
                  padding: "8px 10px",
                  background: "var(--clr-surface)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  className="skeleton"
                  style={{ width: "40%", height: 10, borderRadius: 4 }}
                />
                <div
                  className="skeleton"
                  style={{ width: "90%", height: 13, borderRadius: 4 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
