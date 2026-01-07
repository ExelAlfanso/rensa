import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Rensa - Photography Community";
export const size = {
  width: 1200,
  height: 675,
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
          style={{ fontSize: "72px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Rensa
        </div>
        <div style={{ fontSize: "52px", fontWeight: "300" }}>
          Photography Community
        </div>
        <div style={{ fontSize: "40px", fontWeight: "300", marginTop: "30px" }}>
          Share Your Story
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
