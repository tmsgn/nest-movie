export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--clr-bg)",
        paddingTop: 68,
      }}
    >
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 12px 60px" }}
      >
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {/* Player col */}
          <div style={{ flex: "2 1 420px", minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {[95, 90, 90, 88].map((w, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: w, height: 32, borderRadius: 8 }}
                />
              ))}
            </div>
            <div
              className="skeleton"
              style={{ width: "100%", paddingTop: "56.25%", borderRadius: 14 }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <div
                className="skeleton"
                style={{ flex: 1, height: 42, borderRadius: 10 }}
              />
              <div
                className="skeleton"
                style={{ flex: 1, height: 42, borderRadius: 10 }}
              />
            </div>
          </div>

          {/* Info col */}
          <div
            style={{
              flex: "1 1 220px",
              minWidth: 220,
              display: "flex",
              gap: 14,
            }}
          >
            <div
              className="skeleton"
              style={{
                width: 100,
                height: 150,
                borderRadius: 10,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                className="skeleton"
                style={{ width: "80%", height: 20, borderRadius: 6 }}
              />
              <div
                className="skeleton"
                style={{ width: 70, height: 22, borderRadius: 6 }}
              />
              <div
                className="skeleton"
                style={{ width: "60%", height: 12, borderRadius: 4 }}
              />
              <div
                className="skeleton"
                style={{ width: "55%", height: 12, borderRadius: 4 }}
              />
              <div
                className="skeleton"
                style={{ width: "65%", height: 12, borderRadius: 4 }}
              />
            </div>
          </div>
        </div>

        {/* Episode list skeleton */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div
              className="skeleton"
              style={{ width: 80, height: 18, borderRadius: 6 }}
            />
            <div
              className="skeleton"
              style={{ width: 110, height: 34, borderRadius: 8 }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
              gap: 12,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: "hidden" }}>
                <div
                  className="skeleton"
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: 0,
                  }}
                />
                <div
                  style={{
                    padding: "7px 9px",
                    background: "var(--clr-surface)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <div
                    className="skeleton"
                    style={{ width: "85%", height: 11, borderRadius: 4 }}
                  />
                  <div
                    className="skeleton"
                    style={{ width: "50%", height: 9, borderRadius: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
