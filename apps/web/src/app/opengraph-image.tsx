import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Rensa - Where Every Picture Tells Its Recipe";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #56AD3B 0%, #2d6b1f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          padding: "40px",
        }}
      >
        <div
          style={{ fontSize: "64px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Rensa
        </div>
        <div style={{ fontSize: "48px", fontWeight: "300" }}>
          Where Every Picture
        </div>
        <div style={{ fontSize: "48px", fontWeight: "300" }}>
          Tells Its Recipe
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
