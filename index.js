/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === '/') {
        return env.ASSETS.fetch(request);
      } else if (path === '/available-years') {
        return await handleGetAvailableYears(corsHeaders);
      } else if (path === '/sessions') {
        const year = url.searchParams.get('year');
        return await handleGetSessions(year, corsHeaders);
      } else if (path === '/session-data') {
        const sessionKey = url.searchParams.get('session_key');
        const dataType = url.searchParams.get('type') || 'laps';
        return await handleGetSessionData(sessionKey, dataType, corsHeaders);
      } else if (path === '/processed-data') {
        const sessionKey = url.searchParams.get('session_key');
        return await handleGetProcessedData(sessionKey, corsHeaders);
      } else if (path === '/current-weekend') {
        return await handleGetCurrentWeekend(corsHeaders);
      } else if (path === '/test-ai') {
        return await handleTestAI(env, corsHeaders);
      } else if (path === '/predict-qualifying') {
        const sessionKey = url.searchParams.get('session_key');
        return await handlePredictQualifying(sessionKey, env.AI, corsHeaders);
      } else if (path === '/predict-race') {
        const qualifyingKey = url.searchParams.get('qualifying_key');
        return await handlePredictRace(qualifyingKey, env.AI, corsHeaders);
      } else {
        return new Response(JSON.stringify({
          error: 'Not found',
          message: 'Visit the root URL (/) for the F1 AI Predictor interface',
          endpoints: [
            '/ - F1 AI Predictor Web Interface',
            '/available-years - Get available F1 seasons',
            '/sessions?year=YYYY - Get sessions for specific year',
            '/session-data?session_key=X&type=laps - Get session data',
            '/processed-data?session_key=X - Get processed session analysis',
            '/current-weekend - Get current race weekend data',
            '/test-ai - Test Workers AI integration',
            '/predict-qualifying?session_key=X - Predict qualifying results',
            '/predict-race?qualifying_key=X - Predict race results'
          ]
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}

// --- Handler Functions ---

async function handleGetAvailableYears(corsHeaders) {
  const current_year = new Date().getFullYear();
  const available_years = [];
  for (let y = 2021; y <= current_year; y++) available_years.push(y);
  return new Response(JSON.stringify({
    available_years,
    current_year
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleGetSessions(year, corsHeaders) {
  const selectedYear = year || new Date().getFullYear().toString();
  const resp = await fetch(`https://api.openf1.org/v1/sessions?year=${selectedYear}`);
  const sessions = await resp.json();
  const weekends = {};

  sessions.forEach(session => {
    const meetingKey = session.meeting_key || `${session.country_name}_${session.date_start.split('T')[0]}`;
    if (!weekends[meetingKey]) {
      weekends[meetingKey] = {
        meeting_key: session.meeting_key,
        country: session.country_name,
        location: session.location,
        meeting_name: session.meeting_name || `${session.country_name} Grand Prix`,
        year: session.year,
        date_start: session.date_start,
        sessions: []
      };
    }
    weekends[meetingKey].sessions.push({
      session_key: session.session_key,
      session_name: session.session_name,
      session_type: session.session_type,
      date_start: session.date_start,
      date_end: session.date_end
    });
  });

  return new Response(JSON.stringify({
    year: parseInt(selectedYear),
    total_sessions: sessions.length,
    weekends: Object.values(weekends).sort((a, b) => new Date(a.date_start) - new Date(b.date_start))
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleGetSessionData(sessionKey, dataType, corsHeaders) {
  // Example: fetch laps or telemetry for a session
  let url;
  if (dataType === 'laps') {
    url = `https://api.openf1.org/v1/lap_times?session_key=${sessionKey}`;
  } else if (dataType === 'telemetry') {
    url = `https://api.openf1.org/v1/position?session_key=${sessionKey}`;
  } else {
    url = `https://api.openf1.org/v1/lap_times?session_key=${sessionKey}`;
  }
  const resp = await fetch(url);
  const data = await resp.json();
  return new Response(JSON.stringify({
    session_key: sessionKey,
    type: dataType,
    data
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleGetProcessedData(sessionKey, corsHeaders) {
  // Placeholder: implement as needed
  return new Response(JSON.stringify({
    session_key: sessionKey,
    processed: {}
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleGetCurrentWeekend(corsHeaders) {
  // Placeholder: implement as needed
  return new Response(JSON.stringify({
    current_weekend: {}
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handleTestAI(env, corsHeaders) {
  // Placeholder: implement as needed
  return new Response(JSON.stringify({
    test: true,
    message: "AI integration test successful"
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handlePredictQualifying(sessionKey, ai, corsHeaders) {
  // 1. Fetch practice session lap data
  const lapsResp = await fetch(`https://api.openf1.org/v1/lap_times?session_key=${sessionKey}`);
  const laps = await lapsResp.json();

  // 2. Summarize data for AI
  const drivers = new Set();
  let fastestLap = Infinity;
  laps.forEach(lap => {
    drivers.add(lap.driver_number);
    if (lap.lap_time && lap.lap_time < fastestLap) fastestLap = lap.lap_time;
  });

  const summary = {
    total_drivers: drivers.size,
    total_laps: laps.length,
    fastest_lap: isFinite(fastestLap) ? fastestLap : null
  };

  // 3. Prepare prompt for AI
  const aiPrompt = `
You are an F1 data expert. Given this practice session summary:
- Total drivers: ${summary.total_drivers}
- Total laps: ${summary.total_laps}
- Fastest lap: ${summary.fastest_lap ? summary.fastest_lap.toFixed(3) : 'N/A'} seconds

Predict the likely top 10 qualifying order (driver names only, comma-separated, most likely first):
`;

  // 4. Call Workers AI (Llama 3 8B Instruct)
  let aiResult;
  try {
    aiResult = await ai.run("@cf/meta/llama-3-8b-instruct", {
      prompt: aiPrompt,
      max_tokens: 128
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "AI prediction failed", message: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 5. Try to parse the AI's response into a structured list
  let predicted_order = [];
  if (aiResult.result) {
    predicted_order = aiResult.result
      .replace(/\n/g, '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean)
      .slice(0, 10);
  }

  return new Response(JSON.stringify({
    practice_data_summary: summary,
    ai_prediction: {
      raw_response: aiResult.result,
      structured_prediction: {
        predicted_order
      }
    }
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handlePredictRace(qualifyingKey, ai, corsHeaders) {
  // 1. Fetch qualifying session lap data
  const lapsResp = await fetch(`https://api.openf1.org/v1/lap_times?session_key=${qualifyingKey}`);
  const laps = await lapsResp.json();

  // 2. Summarize qualifying data
  let polePosition = null;
  let fastestLap = Infinity;
  const drivers = new Set();
  laps.forEach(lap => {
    drivers.add(lap.driver_number);
    if (lap.lap_time && lap.lap_time < fastestLap) {
      fastestLap = lap.lap_time;
      polePosition = lap;
    }
  });

  const summary = {
    pole_position: polePosition
      ? { driver_name: polePosition.driver_name, team: polePosition.team_name }
      : null,
    total_drivers: drivers.size,
    fastest_lap: isFinite(fastestLap) ? fastestLap : null
  };

  // 3. Prepare prompt for AI
  const aiPrompt = `
You are an F1 data expert. Given this qualifying session summary:
- Pole position: ${summary.pole_position ? summary.pole_position.driver_name + " (" + summary.pole_position.team + ")" : "Unknown"}
- Total drivers: ${summary.total_drivers}
- Fastest lap: ${summary.fastest_lap ? summary.fastest_lap.toFixed(3) : 'N/A'} seconds

Predict the likely top 10 race finishing order (driver names only, comma-separated, most likely first).
Also, list up to 3 drivers who are likely to gain the most positions during the race (comma-separated, after "Position Gainers:").
`;

  // 4. Call Workers AI
  let aiResult;
  try {
    aiResult = await ai.run("@cf/meta/llama-3-8b-instruct", {
      prompt: aiPrompt,
      max_tokens: 180
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "AI prediction failed", message: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 5. Parse AI response for order and position gainers
  let predicted_race_order = [];
  let position_gainers = [];
  if (aiResult.result) {
    // Try to extract "Position Gainers:" section if present
    const [orderPart, gainersPart] = aiResult.result.split(/Position Gainers:/i);
    predicted_race_order = orderPart
      .replace(/\n/g, '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean)
      .slice(0, 10);
    if (gainersPart) {
      position_gainers = gainersPart
        .replace(/\n/g, '')
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)
        .slice(0, 3);
    }
  }

  return new Response(JSON.stringify({
    qualifying_data_summary: summary,
    ai_prediction: {
      raw_response: aiResult.result,
      structured_prediction: {
        predicted_race_order,
        position_gainers
      }
    }
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
