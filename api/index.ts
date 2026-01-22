import { createApp } from '../server/app';

// Vercel Serverless Function Entry Point
export default async function handler(req, res) {
  try {
    const { app } = await createApp();
    app(req, res);
  } catch (err) {
    console.error("Failed to initialize app:", err);
    res.status(500).json({ message: "Internal Server Error", error: String(err) });
  }
}
