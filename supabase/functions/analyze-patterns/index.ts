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

    // Get last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('checkin_date', sevenDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true });

    const { data: responses } = await supabase
      .from('user_responses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    const prompt = `You are an AI sleep specialist. Analyze this user's sleep data and responses to identify patterns and root causes of their insomnia.

Daily check-ins (last 7 days):
${JSON.stringify(checkins, null, 2)}

Assessment responses:
${JSON.stringify(responses, null, 2)}

Provide a comprehensive analysis including:
1. Key patterns identified in their sleep data
2. Potential root causes of their insomnia
3. Sleep quality trends
4. Correlations between different factors (stress, energy, sleep quality)
5. Risk factors and areas of concern

Return ONLY a JSON object with this structure:
{
  "patterns": {
    "sleep_quality_trend": "improving/declining/stable",
    "average_sleep_duration": "number",
    "consistency_score": "1-10",
    "stress_correlation": "description",
    "energy_correlation": "description"
  },
  "insights": "detailed narrative analysis",
  "root_causes": ["list", "of", "identified", "causes"],
  "risk_level": "low/medium/high",
  "recommendations": ["list", "of", "immediate", "recommendations"]
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
          { role: 'system', content: 'You are an expert sleep specialist AI that analyzes sleep patterns and identifies insomnia causes. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error('Failed to parse analysis JSON:', analysisText);
      throw new Error('Invalid response format from AI');
    }

    // Store analysis in database
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('sleep_patterns').upsert({
      user_id: user.id,
      analysis_date: today,
      pattern_data: analysis.patterns,
      insights: analysis.insights,
      recommendations: analysis.recommendations
    });

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-patterns function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});