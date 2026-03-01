export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--clr-bg)",
        paddingTop: 68,
      }}
    >
      {/* Hero skeleton */}
      <div
        className="skeleton"
        style={{
          width: "100%",
          height: "clamp(200px,42vh,480px)",
          borderRadius: 0,
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 60px" }}>
        {/* Title card */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: -110,
            position: "relative",
            zIndex: 10,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div
            className="skeleton"
            style={{ width: 160, height: 240, borderRadius: 12, flexShrink: 0 }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              paddingBottom: 8,
            }}
          >
            <div
              className="skeleton"
              style={{ width: "45%", height: 16, borderRadius: 6 }}
            />
            <div
              className="skeleton"
              style={{ width: "75%", height: 36, borderRadius: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {[80, 60, 50, 40].map((w, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: w, height: 26, borderRadius: 8 }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[70, 80, 65].map((w, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: w, height: 22, borderRadius: 99 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Overview */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            className="skeleton"
            style={{ width: 100, height: 16, borderRadius: 6 }}
          />
          <div
            className="skeleton"
            style={{ width: "100%", height: 12, borderRadius: 6 }}
          />
          <div
            className="skeleton"
            style={{ width: "92%", height: 12, borderRadius: 6 }}
          />
          <div
            className="skeleton"
            style={{ width: "80%", height: 12, borderRadius: 6 }}
          />
        </div>

        {/* Player skeleton */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[90, 90, 90, 80].map((w, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ width: w, height: 34, borderRadius: 8 }}
              />
            ))}
          </div>
          <div
            className="skeleton"
            style={{ width: "100%", paddingTop: "56.25%", borderRadius: 14 }}
          />
        </div>
      </div>
    </div>
  );
}
