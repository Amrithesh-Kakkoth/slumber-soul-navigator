import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  allowedHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type']
}));
app.use(express.json());

const groqApiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: groqApiKey });
const supabaseUrl = process.env.SUPABASE_URL || 'https://tuoqoxtobyuuzgbfizsm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1b3FveHRvYnl1dXpnYmZpenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDYxMjYsImV4cCI6MjA2ODUyMjEyNn0.WEqKoCA60h759nA61n7KprGdej-Bwo6gepelsZk580c';

// Generate suggestions endpoint
app.post('/generate-suggestions', async (req, res) => {
  try {
    // Get user info from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get latest sleep analysis
    const { data: latestAnalysis } = await supabase
      .from('sleep_patterns')
      .select('*')
      .eq('user_id', user.id)
      .order('analysis_date', { ascending: false })
      .limit(1)
      .single();

    // Get recent check-ins
    const { data: recentCheckIns } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('checkin_date', { ascending: false })
      .limit(7);

    // Get user responses
    const { data: responses } = await supabase
      .from('user_responses')
      .select('*')
      .eq('user_id', user.id);

    const prompt = `You are an AI sleep coach. Based on the user's sleep analysis and recent data, generate personalized suggestions for improving their sleep.

Latest Sleep Analysis:
${JSON.stringify(latestAnalysis, null, 2)}

Recent Check-ins:
${JSON.stringify(recentCheckIns, null, 2)}

User Responses:
${JSON.stringify(responses, null, 2)}

Generate specific, actionable suggestions in three categories:
1. Immediate actions (tonight/today)
2. Weekly goals (this week)
3. Long-term changes (next 2-4 weeks)

Each suggestion should be:
- Specific and actionable
- Based on their actual data patterns
- Realistic and achievable
- Evidence-based

Return ONLY a JSON object with this structure:
{
  "immediate": [
    {
      "title": "Short actionable title",
      "description": "Detailed explanation and instructions",
      "priority": 1
    }
  ],
  "weekly": [
    {
      "title": "Weekly goal title",
      "description": "What to do and why",
      "priority": 2
    }
  ],
  "longterm": [
    {
      "title": "Long-term change title", 
      "description": "How to implement this change",
      "priority": 3
    }
  ]
}`;

    // Use groq-sdk for chat completion
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: 'You are an expert sleep coach AI that creates personalized, actionable sleep improvement plans. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const suggestionsText = chatCompletion.choices[0]?.message?.content || '';
    let suggestions;
    try {
      suggestions = JSON.parse(suggestionsText);
    } catch (e) {
      console.error('Failed to parse suggestions JSON:', suggestionsText);
      throw new Error('Invalid response format from AI');
    }

    // Store suggestions in database
    const allSuggestions = [
      ...suggestions.immediate.map((s: any) => ({ ...s, suggestion_type: 'immediate' })),
      ...suggestions.weekly.map((s: any) => ({ ...s, suggestion_type: 'weekly' })),
      ...suggestions.longterm.map((s: any) => ({ ...s, suggestion_type: 'longterm' }))
    ];

    for (const suggestion of allSuggestions) {
      await supabase.from('suggestions').insert({
        user_id: user.id,
        suggestion_type: suggestion.suggestion_type,
        title: suggestion.title,
        description: suggestion.description,
        priority: suggestion.priority
      });
    }

    const { data: suggestionsData, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('user_id', user.id)
      .in('is_completed', [false, null]) // <-- include nulls
      .order('created_at', { ascending: false });

    res.json(suggestionsData);
  } catch (error: any) {
    console.error('Error in generate-suggestions function:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`AI Suggestions API server running on port ${port}`);
});

export default app;
