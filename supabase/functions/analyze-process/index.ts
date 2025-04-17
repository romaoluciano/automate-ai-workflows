
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
if (!openAIApiKey) {
  console.error("Missing OPENAI_API_KEY env variable");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { diagnosisData, userId } = await req.json();
    
    // Create Supabase client with service role key for DB operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create initial diagnosis record
    const { data: diagnosisRecord, error: insertError } = await supabase
      .from('diagnoses')
      .insert({
        input_data: diagnosisData,
        user_id: userId,
        status: 'processing'
      })
      .select()
      .single();
      
    if (insertError) {
      throw new Error(`Failed to create diagnosis record: ${insertError.message}`);
    }
    
    // Format process information for OpenAI
    const prompt = createPromptFromDiagnosisData(diagnosisData);
    
    // Call OpenAI to analyze the process and generate recommendations
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert process automation consultant. Analyze business processes and suggest automation opportunities. Provide detailed recommendations with estimated time savings, implementation complexity, and return on investment. Format your response as structured JSON for each recommendation.'
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });
    
    const aiResult = await openAIResponse.json();
    
    if (!aiResult.choices || !aiResult.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }
    
    // Parse AI recommendations from the response
    const aiContent = aiResult.choices[0].message.content;
    const recommendations = JSON.parse(aiContent);
    
    // Update the diagnosis record with AI recommendations
    const { error: updateError } = await supabase
      .from('diagnoses')
      .update({
        ai_recommendations: recommendations,
        status: 'completed'
      })
      .eq('id', diagnosisRecord.id);
      
    if (updateError) {
      throw new Error(`Failed to update diagnosis with recommendations: ${updateError.message}`);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      diagnosisId: diagnosisRecord.id,
      recommendations: recommendations.recommendations || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in analyze-process function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper function to format diagnosis data into a prompt for OpenAI
function createPromptFromDiagnosisData(data: any): string {
  return `
Please analyze this business process and suggest automation opportunities:

Process Area: ${data.area}${data.areaCustom ? ` (${data.areaCustom})` : ''}
Description: ${data.descricaoProcesso}
Frequency: ${data.frequencia}
Average Time: ${data.tempoMedio}
Tools Used: ${data.ferramentas}
Current Challenges: ${data.desafios}

Based on this information, provide automation recommendations with the following details for each:
1. Automation Title
2. Description of the automation
3. Benefits (list specific benefits with metrics where possible)
4. Implementation complexity (Low, Medium, High)
5. Estimated implementation time
6. Estimated ROI or time savings

Format your response as a JSON object with an array of recommendations. Each recommendation should be structured as follows:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description of the automation",
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "complexity": "Low/Medium/High",
      "implementationTime": "Estimated time (e.g., '1-2 days')",
      "timeSavings": "Estimated time savings (e.g., '5 hours weekly')"
    },
    ...more recommendations
  ]
}
`;
}
