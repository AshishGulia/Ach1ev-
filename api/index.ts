import { createApiApp } from '../server/app.js';

// Vercel Serverless Function entrypoint handling all `/api/*` routes
const app = createApiApp();

export default app;
