import { createApp } from "./app";
import { serveStatic } from "./static";

(async () => {
  const { app, httpServer } = await createApp();

  // Setup Vite/Static files only for local dev/production server (not Vercel)
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    console.log(`serving on port ${port}`);
  });
})();
