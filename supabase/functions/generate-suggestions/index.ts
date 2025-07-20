// This file is now deprecated - use the Node.js API server at /api/generate-suggestions.js instead
// 
// The new API endpoint is: http://localhost:3001/generate-suggestions
// 
// To run the new API server:
// 1. Install dependencies: npm install express cors dotenv
// 2. Set up your .env file with GROQ_API_KEY
// 3. Run: npm run dev:api
//
// The functionality has been moved to a more reliable Node.js/Express server
// that doesn't rely on Deno runtime issues.

export default function deprecatedFunction() {
  return {
    message: "This function has been replaced with a Node.js API server",
    newEndpoint: "http://localhost:3001/generate-suggestions",
    instructions: "Run 'npm run dev:api' to start the new API server"
  };
}