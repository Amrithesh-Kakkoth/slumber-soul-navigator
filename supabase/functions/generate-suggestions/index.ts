import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const groqApiKey = Deno.env.get('GROQ_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user info from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
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
      "priority": 1-3
    }
  ],
  "weekly": [
    {
      "title": "Weekly goal title",
      "description": "What to do and why",
      "priority": 1-3
    }
  ],
  "longterm": [
    {
      "title": "Long-term change title", 
      "description": "How to implement this change",
      "priority": 1-3
    }
  ]
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert sleep coach AI that creates personalized, actionable sleep improvement plans. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const suggestionsText = data.choices[0].message.content;
    
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

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});