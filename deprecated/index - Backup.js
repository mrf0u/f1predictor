// Complete F1 AI Predictor Worker with integrated HTML interface
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>F1 AI Predictor</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .hero {
            background: linear-gradient(135deg, #e10600 0%, #ff4444 50%, #e10600 100%);
            padding: 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="rgba(255,255,255,0.05)"/></svg>');
            background-size: 200px 100px;
            animation: wave 20s linear infinite;
        }

        @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-200px); }
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
            position: relative;
        }

        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            position: relative;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .season-selector {
            background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            text-align: center;
        }

        .season-selector .form-group {
            margin-bottom: 0;
            max-width: 300px;
            margin: 0 auto;
        }

        .season-selector label {
            font-size: 1.1rem;
            font-weight: 700;
            color: #e10600;
            margin-bottom: 1rem;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-top: 2rem;
        }

        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }

        .card {
            background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #e10600, #ff4444, #e10600);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 60px rgba(225,6,0,0.2);
        }

        .card:hover::before {
            transform: scaleX(1);
        }

        .card h2 {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .icon {
            width: 24px;
            height: 24px;
            fill: #e10600;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #cccccc;
        }

        .select-container {
            position: relative;
        }

        select {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255,255,255,0.05);
            border: 2px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            color: #ffffff;
            font-size: 1rem;
            transition: all 0.3s ease;
            appearance: none;
            cursor: pointer;
        }

        select:focus {
            outline: none;
            border-color: #e10600;
            box-shadow: 0 0 0 3px rgba(225,6,0,0.2);
        }

        select option {
            background: #2a2a2a;
            color: #ffffff;
            padding: 8px;
        }

        .select-container::after {
            content: '▼';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #e10600;
            pointer-events: none;
            font-size: 12px;
        }

        .button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #e10600, #ff4444);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        }

        .button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }

        .button:hover::before {
            left: 100%;
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(225,6,0,0.4);
        }

        .button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .loading {
            display: none;
            text-align: center;
            margin: 1rem 0;
        }

        .spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 4px solid rgba(225,6,0,0.3);
            border-radius: 50%;
            border-top-color: #e10600;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .result {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(0,255,0,0.1);
            border: 1px solid rgba(0,255,0,0.3);
            border-radius: 12px;
            display: none;
        }

        .result.error {
            background: rgba(255,0,0,0.1);
            border-color: rgba(255,0,0,0.3);
        }

        .result h3 {
            margin-bottom: 1rem;
            color: #00ff00;
        }

        .result.error h3 {
            color: #ff4444;
        }

        .prediction-content {
            background: rgba(255,255,255,0.05);
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
        }

        .prediction-order {
            list-style: none;
            padding: 0;
        }

        .prediction-order li {
            padding: 0.5rem;
            margin: 0.25rem 0;
            background: rgba(255,255,255,0.05);
            border-radius: 6px;
            border-left: 3px solid #e10600;
        }

        .session-info {
            background: rgba(255,255,255,0.05);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }

        .api-status {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 1000;
        }

        .api-status.loading {
            background: rgba(255,165,0,0.2);
            border: 1px solid orange;
            color: orange;
        }

        .api-status.success {
            background: rgba(0,255,0,0.2);
            border: 1px solid green;
            color: lightgreen;
        }

        .api-status.error {
            background: rgba(255,0,0,0.2);
            border: 1px solid red;
            color: lightcoral;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/F1_%28registered_trademark%29.svg/275px-F1_%28registered_trademark%29.svg.png" alt="F1" style="height: 60px; vertical-align: middle; margin-right: 15px;">AI Predictor</h1>
        <p>Predict qualifying and race results using AI-powered analysis of F1 telemetry data</p>
    </div>

    <div class="container">
        <div class="season-selector">
            <div class="form-group">
                <label for="seasonSelect">Select Season:</label>
                <div class="select-container">
                    <select id="seasonSelect">
                        <option value="">Loading seasons...</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    Qualifying Prediction
                </h2>
                
                <div class="form-group">
                    <label for="practiceSession">Select Practice Session:</label>
                    <div class="select-container">
                        <select id="practiceSession">
                            <option value="">Select a season first</option>
                        </select>
                    </div>
                </div>

                <div class="session-info" id="practiceInfo" style="display: none;">
                    <strong>Session Details:</strong><br>
                    <span id="practiceDetails"></span>
                </div>

                <button class="button" id="predictQualifying" disabled>
                    Predict Qualifying Results
                </button>

                <div class="loading" id="qualifyingLoading">
                    <div class="spinner"></div>
                    <p>AI is analyzing practice data...</p>
                </div>

                <div class="result" id="qualifyingResult"></div>
            </div>

            <div class="card">
                <h2>
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.8 3.4 14.6 3.3 14.4 3.3C14 3.3 13.6 3.5 13.3 3.8L9.8 7.3C9.4 7.7 9.4 8.4 9.8 8.8C10.2 9.2 10.9 9.2 11.3 8.8L13.5 6.6L15.5 7.8L10.9 12.4C10.7 12.6 10.6 12.8 10.6 13.1L10.1 16.3L7.1 14.2C6.8 14 6.4 14 6.1 14.2L2.5 16.8C2.1 17.1 2 17.6 2.3 18C2.6 18.4 3.1 18.5 3.5 18.2L6.6 16L11.6 19.2C12 19.4 12.5 19.3 12.8 18.9C13.1 18.5 13 18 12.6 17.7L10.4 16.1L10.8 13.9L15.2 9.5L17.9 10.2C18.4 10.3 18.9 10 19 9.5C19.1 9 18.8 8.5 18.3 8.4L15.2 7.5L17.2 8.5L21 9Z"/>
                    </svg>
                    Race Prediction
                </h2>
                
                <div class="form-group">
                    <label for="qualifyingSession">Select Qualifying Session:</label>
                    <div class="select-container">
                        <select id="qualifyingSession">
                            <option value="">Select a season first</option>
                        </select>
                    </div>
                </div>

                <div class="session-info" id="raceInfo" style="display: none;">
                    <strong>Qualifying Session:</strong><br>
                    <div id="raceDetails"></div>
                </div>

                <button class="button" id="predictRace" disabled>
                    Predict Race Results
                </button>

                <div class="loading" id="raceLoading">
                    <div class="spinner"></div>
                    <p>AI is analyzing qualifying data...</p>
                </div>

                <div class="result" id="raceResult"></div>
            </div>
        </div>
    </div>

    <div class="api-status" id="apiStatus" style="display: none;"></div>

    <script>
        const API_BASE = '';
        let allSessions = [];
        let currentSeason = new Date().getFullYear();

        document.addEventListener('DOMContentLoaded', function() {
            loadAvailableYears();
            setupEventListeners();
        });

        async function loadAvailableYears() {
            try {
                showApiStatus('Loading available seasons...', 'loading');
                const response = await fetch('/available-years');
                const data = await response.json();
                const seasonSelect = document.getElementById('seasonSelect');
                seasonSelect.innerHTML = '';
                data.available_years.forEach(year => {
                    const option = new Option(year, year);
                    if (year === data.current_year) {
                        option.selected = true;
                        currentSeason = year;
                    }
                    seasonSelect.add(option);
                });
                await loadSessions(currentSeason);
                showApiStatus('Seasons loaded successfully', 'success');
                setTimeout(() => hideApiStatus(), 2000);
            } catch (error) {
                console.error('Error loading seasons:', error);
                showApiStatus('Failed to load seasons', 'error');
            }
        }

        async function loadSessions(year) {
            try {
                showApiStatus('Loading ' + year + ' F1 sessions...', 'loading');
                const response = await fetch('/sessions?year=' + year);
                const data = await response.json();
                allSessions = data.weekends;
                currentSeason = data.year;
                populateSessionDropdowns();
                showApiStatus(year + ' sessions loaded successfully', 'success');
                setTimeout(() => hideApiStatus(), 2000);
            } catch (error) {
                console.error('Error loading sessions:', error);
                showApiStatus('Failed to load sessions', 'error');
            }
        }

        function populateSessionDropdowns() {
            const practiceSelect = document.getElementById('practiceSession');
            const qualifyingSelect = document.getElementById('qualifyingSession');
            practiceSelect.innerHTML = '<option value="">Select a practice session</option>';
            qualifyingSelect.innerHTML = '<option value="">Select a qualifying session</option>';
            allSessions.forEach(weekend => {
                const practiceSessions = weekend.sessions.filter(session => session.session_type === 'Practice');
                const qualifyingSessions = weekend.sessions.filter(session => session.session_type === 'Qualifying');
                if (practiceSessions.length > 0) {
                    practiceSessions.forEach(session => {
                        const optionText = weekend.meeting_name + ' - ' + session.session_name + ' (' + formatDate(session.date_start) + ')';
                        const option = new Option(optionText, session.session_key);
                        option.dataset.weekend = JSON.stringify(weekend);
                        practiceSelect.add(option);
                    });
                }
                if (qualifyingSessions.length > 0) {
                    qualifyingSessions.forEach(session => {
                        const optionText = weekend.meeting_name + ' - ' + session.session_name + ' (' + formatDate(session.date_start) + ')';
                        const option = new Option(optionText, session.session_key);
                        option.dataset.weekend = JSON.stringify(weekend);
                        option.dataset.session = JSON.stringify(session);
                        qualifyingSelect.add(option);
                    });
                }
            });
            updateButtonStates();
        }

        function setupEventListeners() {
            document.getElementById('seasonSelect').addEventListener('change', function() {
                const selectedYear = this.value;
                if (selectedYear) {
                    hideAllPredictions();
                    loadSessions(selectedYear);
                }
            });
            document.getElementById('practiceSession').addEventListener('change', function() {
                hidePrediction('qualifyingResult');
                updatePracticeInfo();
                updateButtonStates();
            });
            document.getElementById('predictQualifying').addEventListener('click', function() {
                predictQualifying();
            });
            document.getElementById('qualifyingSession').addEventListener('change', function() {
                hidePrediction('raceResult');
                updateRaceInfo();
                updateButtonStates();
            });
            document.getElementById('predictRace').addEventListener('click', function() {
                predictRace();
            });
        }

        function hideAllPredictions() {
            hidePrediction('qualifyingResult');
            hidePrediction('raceResult');
        }

        function hidePrediction(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = 'none';
            }
        }

        function updatePracticeInfo() {
            const select = document.getElementById('practiceSession');
            const infoDiv = document.getElementById('practiceInfo');
            const detailsSpan = document.getElementById('practiceDetails');
            if (select.value) {
                const weekend = JSON.parse(select.selectedOptions[0].dataset.weekend);
                const session = weekend.sessions.find(s => s.session_key == select.value);
                detailsSpan.innerHTML = '<strong>' + weekend.meeting_name + '</strong><br>' + weekend.country + ' - ' + weekend.location + '<br>Session: ' + session.session_name + '<br>Date: ' + formatDate(session.date_start);
                infoDiv.style.display = 'block';
            } else {
                infoDiv.style.display = 'none';
            }
        }

        function updateRaceInfo() {
            const qualifyingSelect = document.getElementById('qualifyingSession');
            const infoDiv = document.getElementById('raceInfo');
            const detailsDiv = document.getElementById('raceDetails');
            if (qualifyingSelect.value) {
                const weekend = JSON.parse(qualifyingSelect.selectedOptions[0].dataset.weekend);
                const qualifyingSession = JSON.parse(qualifyingSelect.selectedOptions[0].dataset.session);
                detailsDiv.innerHTML = '<strong>' + weekend.meeting_name + '</strong><br>' + weekend.country + ' - ' + weekend.location + '<br>Qualifying: ' + qualifyingSession.session_name + ' (' + formatDate(qualifyingSession.date_start) + ')';
                infoDiv.style.display = 'block';
            } else {
                infoDiv.style.display = 'none';
            }
        }

        function updateButtonStates() {
            const practiceSession = document.getElementById('practiceSession').value;
            const qualifyingSession = document.getElementById('qualifyingSession').value;
            document.getElementById('predictQualifying').disabled = !practiceSession;
            document.getElementById('predictRace').disabled = !qualifyingSession;
        }

        async function predictQualifying() {
            const sessionKey = document.getElementById('practiceSession').value;
            const loadingDiv = document.getElementById('qualifyingLoading');
            const resultDiv = document.getElementById('qualifyingResult');
            const button = document.getElementById('predictQualifying');
            try {
                loadingDiv.style.display = 'block';
                resultDiv.style.display = 'none';
                button.disabled = true;
                showApiStatus('AI is analyzing practice data...', 'loading');
                const response = await fetch('/predict-qualifying?session_key=' + sessionKey);
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.message || data.error);
                }
                displayQualifyingResults(data);
                showApiStatus('Qualifying prediction completed', 'success');
            } catch (error) {
                console.error('Error predicting qualifying:', error);
                displayError(resultDiv, 'Failed to predict qualifying results: ' + error.message);
                showApiStatus('Prediction failed', 'error');
            } finally {
                loadingDiv.style.display = 'none';
                button.disabled = false;
                setTimeout(() => hideApiStatus(), 3000);
            }
        }

        async function predictRace() {
            const qualifyingKey = document.getElementById('qualifyingSession').value;
            const loadingDiv = document.getElementById('raceLoading');
            const resultDiv = document.getElementById('raceResult');
            const button = document.getElementById('predictRace');
            try {
                loadingDiv.style.display = 'block';
                resultDiv.style.display = 'none';
                button.disabled = true;
                showApiStatus('AI is analyzing qualifying data...', 'loading');
                const response = await fetch('/predict-race?qualifying_key=' + qualifyingKey);
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.message || data.error);
                }
                displayRaceResults(data);
                showApiStatus('Race prediction completed', 'success');
            } catch (error) {
                console.error('Error predicting race:', error);
                displayError(resultDiv, 'Failed to predict race results: ' + error.message);
                showApiStatus('Prediction failed', 'error');
            } finally {
                loadingDiv.style.display = 'none';
                button.disabled = false;
                setTimeout(() => hideApiStatus(), 3000);
            }
        }

        function displayQualifyingResults(data) {
            const resultDiv = document.getElementById('qualifyingResult');
            let html = '<h3>🏁 Qualifying Prediction Results</h3><div class="prediction-content"><p><strong>Session Analysis:</strong></p><p>• Drivers: ' + data.practice_data_summary.total_drivers + '</p><p>• Total Laps: ' + data.practice_data_summary.total_laps + '</p><p>• Fastest Lap: ' + (data.practice_data_summary.fastest_lap ? data.practice_data_summary.fastest_lap.toFixed(3) : 'N/A') + 's</p><h4 style="margin-top: 1rem;">AI Prediction:</h4><div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">' + data.ai_prediction.raw_response.substring(0, 500) + '...</div>';
            if (data.ai_prediction.structured_prediction && data.ai_prediction.structured_prediction.predicted_order && data.ai_prediction.structured_prediction.predicted_order.length > 0) {
                html += '<h4 style="margin-top: 1rem;">Predicted Order:</h4><ul class="prediction-order">' + data.ai_prediction.structured_prediction.predicted_order.slice(0, 10).map(prediction => '<li>' + prediction + '</li>').join('') + '</ul>';
            }
            html += '</div>';
            resultDiv.innerHTML = html;
            resultDiv.className = 'result';
            resultDiv.style.display = 'block';
        }

        function displayRaceResults(data) {
            const resultDiv = document.getElementById('raceResult');
            let html = '<h3>🏆 Race Prediction Results</h3><div class="prediction-content"><p><strong>Qualifying Analysis:</strong></p><p>• Pole Position: ' + (data.qualifying_data_summary.pole_position ? data.qualifying_data_summary.pole_position.driver_name || 'Unknown' : 'Unknown') + ' (' + (data.qualifying_data_summary.pole_position ? data.qualifying_data_summary.pole_position.team || 'Unknown' : 'Unknown') + ')</p><p>• Qualifying Drivers: ' + data.qualifying_data_summary.total_drivers + '</p><p>• Fastest Lap: ' + (data.qualifying_data_summary.fastest_lap ? data.qualifying_data_summary.fastest_lap.toFixed(3) : 'N/A') + 's</p><h4 style="margin-top: 1rem;">AI Race Prediction:</h4><div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">' + data.ai_prediction.raw_response.substring(0, 500) + '...</div>';
            if (data.ai_prediction.structured_prediction && data.ai_prediction.structured_prediction.predicted_race_order && data.ai_prediction.structured_prediction.predicted_race_order.length > 0) {
                html += '<h4 style="margin-top: 1rem;">Predicted Race Order:</h4><ul class="prediction-order">' + data.ai_prediction.structured_prediction.predicted_race_order.slice(0, 10).map(prediction => '<li>' + prediction + '</li>').join('') + '</ul>';
            }
            if (data.ai_prediction.structured_prediction && data.ai_prediction.structured_prediction.position_gainers && data.ai_prediction.structured_prediction.position_gainers.length > 0) {
                html += '<h4 style="margin-top: 1rem;">Expected Position Gainers:</h4><ul class="prediction-order">' + data.ai_prediction.structured_prediction.position_gainers.map(gainer => '<li>' + gainer + '</li>').join('') + '</ul>';
            }
            html += '</div>';
            resultDiv.innerHTML = html;
            resultDiv.className = 'result';
            resultDiv.style.display = 'block';
        }

        function displayError(container, message) {
            container.innerHTML = '<h3>❌ Error</h3><p>' + message + '</p>';
            container.className = 'result error';
            container.style.display = 'block';
        }

        function showApiStatus(message, type) {
            const statusDiv = document.getElementById('apiStatus');
            statusDiv.textContent = message;
            statusDiv.className = 'api-status ' + type;
            statusDiv.style.display = 'block';
        }

        function hideApiStatus() {
            document.getElementById('apiStatus').style.display = 'none';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    </script>
</body>
</html>`;

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
        return new Response(HTML_CONTENT, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
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
};

async function handleGetAvailableYears(corsHeaders) {
  const currentYear = new Date().getFullYear();
  const availableYears = [];
  for (let year = 2023; year <= currentYear; year++) {
    availableYears.push(year);
  }
  return new Response(JSON.stringify({
    available_years: availableYears,
    current_year: currentYear,
    default_year: currentYear
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleGetSessions(year, corsHeaders) {
  const selectedYear = year || new Date().getFullYear().toString();
  const response = await fetch(`https://api.openf1.org/v1/sessions?year=${selectedYear}`);
  const sessions = await response.json();
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
  if (!sessionKey) {
    return new Response(JSON.stringify({ error: 'session_key parameter is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let apiUrl;
  switch (dataType) {
    case 'laps': apiUrl = `https://api.openf1.org/v1/laps?session_key=${sessionKey}`; break;
    case 'positions': apiUrl = `https://api.openf1.org/v1/position?session_key=${sessionKey}`; break;
    case 'weather': apiUrl = `https://api.openf1.org/v1/weather?session_key=${sessionKey}`; break;
    case 'drivers': apiUrl = `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`; break;
    case 'intervals': apiUrl = `https://api.openf1.org/v1/intervals?session_key=${sessionKey}`; break;
    default:
      return new Response(JSON.stringify({ error: 'Invalid data type. Use: laps, positions, weather, drivers, intervals' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
  }

  const response = await fetch(apiUrl);
  const data = await response.json();
  return new Response(JSON.stringify({
    session_key: sessionKey,
    data_type: dataType,
    count: data.length,
    data: data
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleGetProcessedData(sessionKey, corsHeaders) {
  if (!sessionKey) {
    return new Response(JSON.stringify({ error: 'session_key parameter is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const [lapsResponse, driversResponse, weatherResponse] = await Promise.all([
      fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/weather?session_key=${sessionKey}`)
    ]);

    const [laps, drivers, weather] = await Promise.all([
      lapsResponse.json(),
      driversResponse.json(),
      weatherResponse.json()
    ]);

    const processedData = processSessionForPrediction(laps, drivers, weather);
    return new Response(JSON.stringify({
      session_key: sessionKey,
      processed_data: processedData,
      raw_counts: { laps: laps.length, drivers: drivers.length, weather_points: weather.length }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to process session data',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetCurrentWeekend(corsHeaders) {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toISOString().split('T')[0];
  const response = await fetch(`https://api.openf1.org/v1/sessions?year=${currentYear}`);
  const sessions = await response.json();
  
  const currentWeekend = sessions
    .filter(session => session.date_start >= currentDate || (new Date(session.date_end) >= new Date(currentDate)))
    .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))[0];

  if (!currentWeekend) {
    return new Response(JSON.stringify({
      message: 'No current or upcoming race weekend found',
      current_date: currentDate
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const weekendSessions = sessions.filter(session => 
    session.country_name === currentWeekend.country_name &&
    session.location === currentWeekend.location &&
    Math.abs(new Date(session.date_start) - new Date(currentWeekend.date_start)) < 7 * 24 * 60 * 60 * 1000
  );

  return new Response(JSON.stringify({
    current_weekend: {
      country: currentWeekend.country_name,
      location: currentWeekend.location,
      year: currentWeekend.year,
      sessions: weekendSessions.map(session => ({
        session_key: session.session_key,
        session_name: session.session_name,
        session_type: session.session_type,
        date_start: session.date_start,
        date_end: session.date_end,
        status: new Date(session.date_end) < new Date() ? 'completed' : 
                new Date(session.date_start) < new Date() ? 'in_progress' : 'upcoming'
      }))
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleTestAI(env, corsHeaders) {
  try {
    if (env?.AI) {
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [{ role: 'user', content: 'Say "AI is working!"' }]
        });
        return new Response(JSON.stringify({
          status: 'success',
          ai_response: aiResponse
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (aiError) {
        return new Response(JSON.stringify({
          status: 'ai_call_failed',
          ai_error: aiError.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else {
      return new Response(JSON.stringify({
        status: 'no_ai_binding'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handlePredictQualifying(sessionKey, AI, corsHeaders) {
  if (!sessionKey) {
    return new Response(JSON.stringify({ error: 'session_key parameter is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const [lapsResponse, driversResponse, weatherResponse] = await Promise.all([
      fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/weather?session_key=${sessionKey}`)
    ]);

    const [laps, drivers, weather] = await Promise.all([
      lapsResponse.json(),
      driversResponse.json(),
      weatherResponse.json()
    ]);

    const processedData = processSessionForPrediction(laps, drivers, weather);
    const prompt = createQualifyingPredictionPrompt(processedData);
    
    const aiResponse = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'You are an expert F1 analyst with deep knowledge of racing strategy, driver performance, and qualifying dynamics. Provide detailed, data-driven predictions based on practice session performance.'
        },
        { role: 'user', content: prompt }
      ]
    });

    const prediction = parseAIPrediction(aiResponse.response, processedData);
    return new Response(JSON.stringify({
      session_key: sessionKey,
      prediction_type: 'qualifying',
      practice_data_summary: {
        total_drivers: processedData.session_summary.total_drivers,
        total_laps: processedData.session_summary.total_laps,
        fastest_lap: processedData.session_summary.fastest_lap,
        weather: processedData.weather_summary
      },
      ai_prediction: {
        raw_response: aiResponse.response,
        structured_prediction: prediction,
        confidence_factors: analyzeConfidenceFactors(processedData),
        ai_usage: aiResponse.usage
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to generate qualifying prediction',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handlePredictRace(qualifyingKey, AI, corsHeaders) {
  if (!qualifyingKey) {
    return new Response(JSON.stringify({ error: 'qualifying_key parameter is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const qualifyingData = await fetchSessionData(qualifyingKey);
    const qualifyingPredictionData = processSessionForPrediction(
      qualifyingData.laps, qualifyingData.drivers, qualifyingData.weather
    );

    const prompt = createRacePredictionFromQualifyingPrompt(qualifyingPredictionData);
    const aiResponse = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'You are an expert F1 race strategist and analyst. You understand how qualifying positions translate to race results, considering tire strategies, weather impacts, overtaking opportunities, and race dynamics. Provide comprehensive race predictions based on qualifying performance.'
        },
        { role: 'user', content: prompt }
      ]
    });

    const prediction = parseRacePredictionFromQualifying(aiResponse.response, qualifyingPredictionData);
    return new Response(JSON.stringify({
      qualifying_session_key: qualifyingKey,
      prediction_type: 'race_from_qualifying',
      qualifying_data_summary: {
        total_drivers: qualifyingPredictionData.session_summary.total_drivers,
        total_laps: qualifyingPredictionData.session_summary.total_laps,
        fastest_lap: qualifyingPredictionData.session_summary.fastest_lap,
        pole_position: qualifyingPredictionData.prediction_features.pace_order[0]
      },
      ai_prediction: {
        raw_response: aiResponse.response,
        structured_prediction: prediction,
        race_factors: analyzeRaceFactors(qualifyingPredictionData),
        ai_usage: aiResponse.usage
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to generate race prediction',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function fetchSessionData(sessionKey) {
  const [lapsResponse, driversResponse, weatherResponse] = await Promise.all([
    fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`),
    fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`),
    fetch(`https://api.openf1.org/v1/weather?session_key=${sessionKey}`)
  ]);

  return {
    laps: await lapsResponse.json(),
    drivers: await driversResponse.json(),
    weather: await weatherResponse.json()
  };
}

function createQualifyingPredictionPrompt(processedData) {
  const topDrivers = processedData.prediction_features.pace_order.slice(0, 10);
  return `Based on the following F1 practice session data, predict the qualifying results:

PRACTICE SESSION ANALYSIS:
- Total drivers: ${processedData.session_summary.total_drivers}
- Fastest lap: ${processedData.session_summary.fastest_lap?.toFixed(3)}s
- Weather: Air temp ${processedData.weather_summary?.avg_air_temp?.toFixed(1)}°C, Track temp ${processedData.weather_summary?.avg_track_temp?.toFixed(1)}°C

TOP 10 PRACTICE PERFORMERS:
${topDrivers.map((driver, index) => 
  `${index + 1}. ${driver.driver_name} (${driver.team}) - ${driver.best_lap?.toFixed(3)}s (Gap: +${driver.gap_to_leader?.toFixed(3)}s, Consistency: ${driver.consistency_score?.toFixed(3)})`
).join('\n')}

Please provide:
1. Your predicted qualifying order (top 10)
2. Key factors that will influence qualifying (weather, track evolution, team strategies)
3. Potential surprises or upsets to watch for
4. Confidence level in your predictions

Consider:
- Practice pace vs qualifying pace differences
- Team and driver historical qualifying performance
- Weather conditions and track evolution
- Tire strategies and fuel loads in practice
- Consistency vs one-lap pace balance`;
}

function createRacePredictionFromQualifyingPrompt(qualifyingData) {
  const qualifyingTop10 = qualifyingData.prediction_features.pace_order.slice(0, 10);
  return `Based on qualifying results, predict the race outcome:

QUALIFYING RESULTS:
${qualifyingTop10.map((driver, index) => 
  `${index + 1}. ${driver.driver_name} (${driver.team}) - ${driver.best_lap?.toFixed(3)}s (Gap: +${driver.gap_to_leader?.toFixed(3)}s)`
).join('\n')}

QUALIFYING CONDITIONS:
- Weather: Air ${qualifyingData.weather_summary?.avg_air_temp?.toFixed(1)}°C, Track ${qualifyingData.weather_summary?.avg_track_temp?.toFixed(1)}°C
- Total qualifying laps: ${qualifyingData.session_summary.total_laps}
- Competitive spread: ${qualifyingData.session_summary.lap_time_spread?.toFixed(3)}s

Please provide:
1. Predicted race finishing order (top 10)
2. Key drivers likely to gain positions from their qualifying spot
3. Key drivers likely to lose positions from their qualifying spot
4. Strategic factors that will influence the race outcome
5. Potential race scenarios and championship implications

Consider:
- Starting position advantages/disadvantages for this track
- Historical performance patterns (pole winner conversion rate, etc.)
- Team race pace vs qualifying pace characteristics
- Tire strategy opportunities
- Weather evolution potential
- Safety car and DRS impact
- Driver racecraft and overtaking ability`;
}

function parseAIPrediction(aiResponse, processedData) {
  return {
    summary: aiResponse.substring(0, 200) + '...',
    key_insights: extractKeyInsights(aiResponse),
    predicted_order: extractPredictedOrder(aiResponse),
    confidence_indicators: assessPredictionConfidence(aiResponse, processedData)
  };
}

function parseRacePredictionFromQualifying(aiResponse, qualifyingData) {
  return {
    summary: aiResponse.substring(0, 300) + '...',
    race_strategy_insights: extractStrategyInsights(aiResponse),
    predicted_race_order: extractPredictedOrder(aiResponse),
    position_gainers: extractPositionGainers(aiResponse),
    position_losers: extractPositionLosers(aiResponse),
    key_battle_points: extractBattlePoints(aiResponse),
    risk_factors: extractRiskFactors(aiResponse)
  };
}

function analyzeConfidenceFactors(processedData) {
  const factors = [];
  if (processedData.session_summary.total_laps > 100) {
    factors.push({ factor: 'Data Quality', level: 'High', reason: 'Sufficient lap data available' });
  } else {
    factors.push({ factor: 'Data Quality', level: 'Medium', reason: 'Limited lap data' });
  }
  if (processedData.weather_summary) {
    factors.push({ factor: 'Weather Stability', level: 'High', reason: 'Consistent conditions' });
  }
  const topGap = processedData.session_summary.lap_time_spread;
  if (topGap < 1.0) {
    factors.push({ factor: 'Competitive Balance', level: 'High', reason: 'Tight competition increases unpredictability' });
  }
  return factors;
}

function analyzeRaceFactors(qualifyingData) {
  const competitiveSpread = qualifyingData.session_summary.lap_time_spread;
  return {
    pole_advantage: {
      driver: qualifyingData.prediction_features.pace_order[0]?.driver_name,
      team: qualifyingData.prediction_features.pace_order[0]?.team,
      margin: qualifyingData.prediction_features.pace_order[1]?.gap_to_leader?.toFixed(3) + 's'
    },
    competitive_balance: {
      top_10_spread: competitiveSpread?.toFixed(3) + 's',
      competitiveness: competitiveSpread < 1.0 ? 'Very tight' : competitiveSpread < 2.0 ? 'Competitive' : 'Spread out'
    },
    track_characteristics: {
      overtaking_difficulty: 'Medium',
      drs_zones: 'Multiple opportunities',
      tire_strategy_importance: 'High'
    }
  };
}

function extractKeyInsights(response) {
  const insights = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (line.includes('factor') || line.includes('key') || line.includes('important')) {
      insights.push(line.trim());
    }
  }
  return insights.slice(0, 5);
}

function extractPredictedOrder(response) {
  const orderLines = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (/^\d+\./.test(line.trim())) {
      orderLines.push(line.trim());
    }
  }
  return orderLines.slice(0, 10);
}

function assessPredictionConfidence(response, data) {
  return {
    data_completeness: data.session_summary.total_laps > 50 ? 'High' : 'Medium',
    weather_consistency: data.weather_summary ? 'High' : 'Unknown',
    competitive_spread: data.session_summary.lap_time_spread < 2.0 ? 'Close competition' : 'Clear hierarchy'
  };
}

function extractStrategyInsights(response) {
  const insights = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (line.includes('strategy') || line.includes('tire') || line.includes('fuel')) {
      insights.push(line.trim());
    }
  }
  return insights;
}

function extractPositionGainers(response) {
  const gainers = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('gain') || line.toLowerCase().includes('move up') || line.toLowerCase().includes('climb')) {
      gainers.push(line.trim());
    }
  }
  return gainers.slice(0, 3);
}

function extractPositionLosers(response) {
  const losers = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('lose') || line.toLowerCase().includes('drop') || line.toLowerCase().includes('fall')) {
      losers.push(line.trim());
    }
  }
  return losers.slice(0, 3);
}

function extractBattlePoints(response) {
  const battles = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('battle') || line.toLowerCase().includes('fight') || line.toLowerCase().includes('versus')) {
      battles.push(line.trim());
    }
  }
  return battles.slice(0, 3);
}

function extractRiskFactors(response) {
  const risks = [];
  const lines = response.split('\n');
  for (const line of lines) {
    if (line.includes('risk') || line.includes('danger') || line.includes('threat')) {
      risks.push(line.trim());
    }
  }
  return risks;
}

function processSessionForPrediction(laps, drivers, weather) {
  const driverLaps = {};
  laps.forEach(lap => {
    if (!driverLaps[lap.driver_number]) {
      driverLaps[lap.driver_number] = [];
    }
    driverLaps[lap.driver_number].push(lap);
  });

  const driverMetrics = {};
  Object.keys(driverLaps).forEach(driverNumber => {
    const driverLapTimes = driverLaps[driverNumber]
      .filter(lap => lap.lap_duration && lap.lap_duration > 0)
      .map(lap => lap.lap_duration)
      .sort((a, b) => a - b);

    if (driverLapTimes.length === 0) return;
    const driver = drivers.find(d => d.driver_number == driverNumber);
    
    driverMetrics[driverNumber] = {
      driver_info: driver ? {
        name: `${driver.first_name} ${driver.last_name}`,
        team: driver.team_name,
        number: driver.driver_number
      } : null,
      lap_count: driverLapTimes.length,
      best_lap: driverLapTimes[0],
      average_lap: driverLapTimes.reduce((a, b) => a + b, 0) / driverLapTimes.length,
      consistency: calculateConsistency(driverLapTimes),
      pace_analysis: {
        top_10_percent: driverLapTimes.slice(0, Math.max(1, Math.floor(driverLapTimes.length * 0.1))),
        long_run_pace: driverLapTimes.length > 5 ? 
          driverLapTimes.slice(-Math.min(10, Math.floor(driverLapTimes.length * 0.5))) : []
      }
    };
  });

  const weatherSummary = weather.length > 0 ? {
    avg_air_temp: weather.reduce((sum, w) => sum + (w.air_temperature || 0), 0) / weather.length,
    avg_track_temp: weather.reduce((sum, w) => sum + (w.track_temperature || 0), 0) / weather.length,
    avg_humidity: weather.reduce((sum, w) => sum + (w.humidity || 0), 0) / weather.length,
    wind_direction: weather[Math.floor(weather.length / 2)]?.wind_direction || null,
    wind_speed: weather[Math.floor(weather.length / 2)]?.wind_speed || null
  } : null;

  const allBestLaps = Object.values(driverMetrics)
    .map(m => m.best_lap)
    .filter(lap => lap > 0)
    .sort((a, b) => a - b);

  return {
    session_summary: {
      total_drivers: Object.keys(driverMetrics).length,
      total_laps: laps.length,
      fastest_lap: allBestLaps[0] || null,
      lap_time_spread: allBestLaps.length > 1 ? allBestLaps[allBestLaps.length - 1] - allBestLaps[0] : 0
    },
    driver_metrics: driverMetrics,
    weather_summary: weatherSummary,
    prediction_features: {
      pace_order: Object.entries(driverMetrics)
        .sort(([,a], [,b]) => a.best_lap - b.best_lap)
        .map(([driverNumber, metrics]) => ({
          driver_number: parseInt(driverNumber),
          driver_name: metrics.driver_info?.name,
          team: metrics.driver_info?.team,
          best_lap: metrics.best_lap,
          gap_to_leader: metrics.best_lap - allBestLaps[0],
          consistency_score: metrics.consistency
        }))
    }
  };
}

function calculateConsistency(lapTimes) {
  if (lapTimes.length < 2) return 0;
  const mean = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
  const variance = lapTimes.reduce((sum, lap) => sum + Math.pow(lap - mean, 2), 0) / lapTimes.length;
  return Math.sqrt(variance);
}