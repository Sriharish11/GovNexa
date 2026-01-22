import { createApp } from '../server/app';

// Vercel Serverless Function Entry Point
export default async function handler(req, res) {
  const { app } = await createApp();
  
  // Forward request to Express app
  app(req, res);
}
