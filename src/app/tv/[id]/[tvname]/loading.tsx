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
        className="skeleton"
        style={{
          width: "100%",
          height: "clamp(180px,38vh,380px)",
          borderRadius: 0,
        }}
      />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 60px" }}>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: -90,
            position: "relative",
            zIndex: 10,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div
            className="skeleton"
            style={{ width: 150, height: 225, borderRadius: 12, flexShrink: 0 }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              className="skeleton"
              style={{ width: "20%", height: 20, borderRadius: 99 }}
            />
            <div
              className="skeleton"
              style={{ width: "70%", height: 34, borderRadius: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {[70, 50, 40].map((w, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: w, height: 26, borderRadius: 8 }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[75, 85, 65].map((w, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: w, height: 22, borderRadius: 99 }}
                />
              ))}
            </div>
            <div
              className="skeleton"
              style={{ width: "90%", height: 12, borderRadius: 6 }}
            />
            <div
              className="skeleton"
              style={{ width: "75%", height: 12, borderRadius: 6 }}
            />
            <div
              className="skeleton"
              style={{ width: 140, height: 40, borderRadius: 99 }}
            />
          </div>
        </div>

        {/* Cast skeleton */}
        <div style={{ marginTop: 44 }}>
          <div
            className="skeleton"
            style={{ width: 60, height: 18, borderRadius: 6, marginBottom: 20 }}
          />
          <div style={{ display: "flex", gap: 14 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  className="skeleton"
                  style={{ width: 70, height: 70, borderRadius: "50%" }}
                />
                <div
                  className="skeleton"
                  style={{ width: 60, height: 10, borderRadius: 4 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Episodes skeleton */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <div
              className="skeleton"
              style={{ width: 90, height: 18, borderRadius: 6 }}
            />
            <div
              className="skeleton"
              style={{ width: 110, height: 36, borderRadius: 8 }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
              gap: 14,
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
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
                    padding: "8px 10px",
                    background: "var(--clr-surface)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    className="skeleton"
                    style={{ width: "85%", height: 12, borderRadius: 4 }}
                  />
                  <div
                    className="skeleton"
                    style={{ width: "50%", height: 10, borderRadius: 4 }}
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
