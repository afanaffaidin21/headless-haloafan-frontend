import { ImageResponse } from "next/og";

export const alt =
  "Ahmad Afan Affaidin — WordPress Developer & Web Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background: "#0a0a0c",
          color: "#f5f2ed",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 84px",
          width: "100%",
        }}
      >
        <div style={{ color: "#4ade80", display: "flex", fontSize: 34 }}>
          haloafan.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: "#4ade80", display: "flex", fontSize: 24 }}>
            PORTFOLIO
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Ahmad Afan Affaidin
          </div>
          <div style={{ color: "#b5b0aa", display: "flex", fontSize: 32 }}>
            WordPress Developer &amp; Web Engineer
          </div>
        </div>
        <div style={{ color: "#b5b0aa", display: "flex", fontSize: 22 }}>
          haloafan.com
        </div>
      </div>
    ),
    size
  );
}
