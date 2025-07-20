# AI Suggestions API

This Node.js/Express API replaces the Deno-based Supabase functions for generating AI suggestions.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   SUPABASE_URL=https://tuoqoxtobyuuzgbfizsm.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3001
   ```

3. **Run the API server:**
   ```bash
   # Run API server only
   npm run dev:api
   
   # Run both frontend and API server
   npm run dev:all
   ```

## Endpoints

### POST /generate-suggestions
Generates AI-powered sleep suggestions based on user data.

**Headers:**
- `Authorization: Bearer {supabase_access_token}`
- `Content-Type: application/json`

**Response:**
```json
{
  "immediate": [
    {
      "title": "Sleep suggestion title",
      "description": "Detailed description",
      "priority": 1
    }
  ],
  "weekly": [...],
  "longterm": [...]
}
```

### GET /health
Health check endpoint.

## Why Node.js instead of Deno?

The original Deno-based Supabase functions were causing runtime issues. This Node.js/Express API provides:

- More reliable runtime environment
- Better error handling
- Easier local development
- Standard npm package ecosystem
- Simpler deployment options

## Deployment

You can deploy this API to any Node.js hosting platform:
- Vercel
- Netlify Functions
- Railway
- Heroku
- AWS Lambda
- DigitalOcean App Platform

Just make sure to set the environment variables in your deployment platform.
