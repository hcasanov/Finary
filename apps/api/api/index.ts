import { handle } from 'hono/vercel';
import { app } from '../src/app';

/**
 * Vercel serverless function entry point.
 * vercel.json rewrites all requests to this function.
 * basePath('/api') aligns Hono routes with the /api prefix Vercel expects.
 */
export const config = { runtime: 'nodejs' };

export default handle(app.basePath('/api'));
