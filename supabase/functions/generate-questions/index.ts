import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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

    const { user_responses, current_patterns } = await req.json();

    // Get user's recent check-ins for context
    const { data: recentCheckIns } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('checkin_date', { ascending: false })
      .limit(7);

    // Analyze patterns and generate contextual questions
    const prompt = `You are an AI sleep specialist. Based on the user's responses and recent sleep data, generate 3-5 follow-up questions to better understand their insomnia patterns.

Previous responses:
${JSON.stringify(user_responses, null, 2)}

Recent sleep data (last 7 days):
${JSON.stringify(recentCheckIns, null, 2)}

Current patterns identified:
${current_patterns || 'None provided'}

Generate 3-5 specific, personalized follow-up questions that will help identify the root cause of their sleep issues. Each question should:
1. Be specific to their previous answers
2. Help narrow down potential causes
3. Be answerable with multiple choice options
4. Focus on areas not yet thoroughly explored

Return ONLY a JSON array of questions in this format:
[
  {
    "question": "Based on your bedtime routine, when do you typically start feeling sleepy?",
    "category": "Sleep Onset Timing",
    "options": ["Before my usual bedtime", "Right at bedtime", "1-2 hours after bedtime", "I never feel naturally sleepy", "It varies significantly"]
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert sleep specialist AI that generates personalized questions for insomnia assessment. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const questionsText = data.choices[0].message.content;
    
    let questions;
    try {
      questions = JSON.parse(questionsText);
    } catch (e) {
      console.error('Failed to parse questions JSON:', questionsText);
      throw new Error('Invalid response format from AI');
    }

    // Store generated questions in database
    for (const question of questions) {
      await supabase.from('questions').insert({
        question_text: question.question,
        category: question.category,
        options: JSON.stringify(question.options),
        order_index: 999, // High number to put at end
        is_active: true
      });
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-questions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});