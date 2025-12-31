import dotenv from "dotenv";
export default async function EnvDebugPage() {
  await dotenv.config({ path: "./envs/frontend.env" });
  // Get all environment variables
  // const allEnvs = Object.entries(process.env);

  // Extract API URLs
  const fastApiUrl = process.env.FAST_API_BASE_URL;
  const elysiaUrl = process.env.ELYSIA_BASE_URL;
  const expressUrl = process.env.EXPRESS_BASE_URL;
  const elysiaWsUrl = process.env.NEXT_PUBLIC_ELYSIA_WS_URL;

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Environment Variables Debug</h1>

      <div
        style={{
          marginTop: "20px",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#e8f4f8",
          borderLeft: "4px solid #0066cc",
        }}
      >
        <h2 style={{ marginTop: 0 }}>🔌 Axios API Base URLs</h2>
        <div style={{ marginTop: "15px" }}>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#0066cc" }}>FastAPI:</strong>{" "}
            <span style={{ color: fastApiUrl ? "#333" : "red" }}>
              {fastApiUrl || "❌ Not configured"}
            </span>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#0066cc" }}>Elysia API:</strong>{" "}
            <span style={{ color: elysiaUrl ? "#333" : "red" }}>
              {elysiaUrl || "❌ Not configured"}
            </span>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#0066cc" }}>Express API:</strong>{" "}
            <span style={{ color: expressUrl ? "#333" : "red" }}>
              {expressUrl || "❌ Not configured"}
            </span>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#0066cc" }}>Elysia WebSocket:</strong>{" "}
            <span style={{ color: elysiaWsUrl ? "#333" : "red" }}>
              {elysiaWsUrl || "❌ Not configured"}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <p style={{ fontSize: "12px", color: "#666" }}>
          💡 Tip: This is a server component showing all environment variables.
          Public variables (NEXT_PUBLIC_*) are available in the browser. Private
          variables are only available server-side and partially masked for
          security.
        </p>
      </div>
    </div>
  );
}
