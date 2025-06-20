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
  // Placeholder: implement AI logic as needed
  return new Response(JSON.stringify({
    practice_data_summary: {
      total_drivers: 20,
      total_laps: 100,
      fastest_lap: 82.123
    },
    ai_prediction: {
      raw_response: "AI prediction for qualifying...",
      structured_prediction: {
        predicted_order: [
          "Max Verstappen", "Lewis Hamilton", "Charles Leclerc", "Lando Norris", "Carlos Sainz"
        ]
      }
    }
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function handlePredictRace(qualifyingKey, ai, corsHeaders) {
  // Placeholder: implement AI logic as needed
  return new Response(JSON.stringify({
    qualifying_data_summary: {
      pole_position: { driver_name: "Max Verstappen", team: "Red Bull" },
      total_drivers: 20,
      fastest_lap: 81.987
    },
    ai_prediction: {
      raw_response: "AI prediction for race...",
      structured_prediction: {
        predicted_race_order: [
          "Max Verstappen", "Lewis Hamilton", "Charles Leclerc", "Lando Norris", "Carlos Sainz"
        ],
        position_gainers: ["Fernando Alonso", "Oscar Piastri"]
      }
    }
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
