import React, { useState } from 'react';
import './AiCreateTrip.css';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function AiCreateTrip({ user, onBack, onViewTrip }) {
  const [step, setStep] = useState(1);
  const [sourceQuery, setSourceQuery] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destQuery, setDestQuery] = useState('');
  const [destSuggestions, setDestSuggestions] = useState([]);
  
  const [startDateTime, setStartDateTime] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchTimerRef = React.useRef(null);

  const searchLocation = (query, setSuggestions) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=7&lat=22.0&lon=78.5&location_bias_scale=0.6&lang=en`);
        const data = await res.json();
        const results = data.features
          .filter(f => {
            const country = (f.properties.country || '').toLowerCase();
            return country === 'india' || country === '';
          })
          .slice(0, 6)
          .map(f => {
            const p = f.properties;
            const parts = [p.name || '', p.city || p.town || p.village || '', p.district || p.county || '', p.state || ''].filter(Boolean);
            const unique = parts.filter((v, i, a) => a.indexOf(v) === i);
            return {
              name: unique.join(', '),
              lat: f.geometry.coordinates[1],
              lon: f.geometry.coordinates[0]
            };
          });
        setSuggestions(results);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
      }
    }, 300);
  };
  
  // Routes from Gemini
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(null);
  
  // Customization step
  const [selectedCheckpoints, setSelectedCheckpoints] = useState({});

  const generateTripPlan = async (isFeedback = false) => {
    if (!sourceQuery || !destQuery || !startDateTime) {
      setError('Please enter source, destination, and start date/time.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    let prompt = `You are an expert travel planner. The user wants to travel from ${sourceQuery} to ${destQuery} by road.
They are starting on ${startDateTime}.

Provide 2 distinct route options. For each route, break the journey down into a day-by-day itinerary (Day 1, Day 2, etc.).
CRITICAL RULES:
1. Provide checkpoints every 150-200 kms. Checkpoints MUST lie directly on or within 10-30 km of the primary highway route.
2. Give preference to National Highways (NH), then State highways. Ensure routes are passable by a 4-wheeler.
3. Calculate realistic driving times between checkpoints, factoring in average traffic and rest breaks.
4. Include the estimated Arrival Time and Departure Time for each checkpoint based on the start time.
5. If driving time exceeds 8-10 hours in a single day, or if it gets too late, schedule an overnight halt at a major city/checkpoint, and resume the journey on the next Day.
6. Provide 2-3 suggestive places to visit for each checkpoint and the final destination. Ensure the city is a prominent tourist attraction with good restaurants.
7. Suggested overnight stays MUST have good 3 to 5-star hotels available.
8. VERY IMPORTANT: When naming checkpoints or destinations, provide the fully qualified name including State and Country (e.g., "Surat, Gujarat, India").

Return ONLY a valid JSON object strictly matching this format without any markdown wrappers (like \`\`\`json):`;

    if (isFeedback && routes.length > 0) {
      prompt = `You previously generated this JSON itinerary:\n${JSON.stringify({routes})}\n\nThe user provided this feedback to revise the plan: "${feedback}"\n\nBased on this feedback, completely regenerate the JSON itinerary following all the CRITICAL RULES below, but incorporating the user's feedback.\n\nCRITICAL RULES:\n1. Checkpoints MUST lie directly on or within 10-30 km of the primary highway route.\n2. Give preference to National Highways (NH), then State highways. Ensure routes are passable by a 4-wheeler.\n3. Provide checkpoints every 150-200 kms.\n4. Calculate realistic driving times.\n5. If driving time exceeds 8-10 hours in a single day, schedule an overnight halt.\n6. Provide 2-3 suggestive places to visit. Ensure the city is a prominent tourist attraction with good restaurants.\n7. Suggested overnight stays MUST have good 3 to 5-star hotels available.\n8. VERY IMPORTANT: When naming checkpoints or destinations, provide the fully qualified name including State and Country (e.g., "Surat, Gujarat, India").\n\nReturn ONLY a valid JSON object strictly matching this format without any markdown wrappers (like \`\`\`json):`;
    }

    const format = `
{
  "routes": [
    {
      "title": "Scenic Route via X",
      "description": "A quick description of the route",
      "days": [
        {
          "day": "Day 1",
          "date": "YYYY-MM-DD",
          "checkpoints": [
            { "name": "City Name 1", "arrivalTime": "11:00 AM", "departureTime": "11:30 AM", "placesToVisit": "Place A, Place B", "isOvernightHalt": false },
            { "name": "City Name 2", "arrivalTime": "05:00 PM", "departureTime": "09:00 AM next day", "placesToVisit": "Place C, Place D", "isOvernightHalt": true }
          ]
        }
      ],
      "destinationPlacesToVisit": "Place X, Place Y",
      "destinationArrivalTime": "02:00 PM"
    }
  ]
}`;

    let retries = 3;
    let success = false;
    let lastError = null;

    while (retries > 0 && !success) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt + '\n' + format }] }],
            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Failed to generate trip');
        
        let aiResponseText = data.candidates[0].content.parts[0].text;
        
        const parsedData = JSON.parse(aiResponseText);
        setRoutes(parsedData.routes);
        setStep(2);
        success = true;
      } catch (err) {
        lastError = err;
        retries--;
        if (retries > 0) {
          console.warn(`Gemini API error. Retrying... (${retries} attempts left)`, err.message);
          // Exponential backoff: Wait 2s, then 4s, etc.
          await new Promise(resolve => setTimeout(resolve, (4 - retries) * 2000));
        }
      }
    }

    if (!success) {
      console.error("All retries failed:", lastError);
      setError('Failed to contact AI planner after multiple attempts. ' + (lastError?.message || ''));
    }

    setLoading(false);
  };

  const handleRouteSelect = (idx) => {
    setSelectedRouteIdx(idx);
    // Auto-select all checkpoints by default
    const route = routes[idx];
    const initialCheckpoints = {};
    let cpIndex = 0;
    route.days.forEach(day => {
      day.checkpoints.forEach(() => {
        initialCheckpoints[cpIndex] = true;
        cpIndex++;
      });
    });
    setSelectedCheckpoints(initialCheckpoints);
    setStep(3);
  };

  const toggleCheckpoint = (idx) => {
    setSelectedCheckpoints(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const geocodeLocation = async (query) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
    } catch (err) {
      console.error('Geocoding failed for', query);
    }
    // Fallback to center of India if not found
    return { lat: 20.5937, lon: 78.9629 };
  };

  const createTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const route = routes[selectedRouteIdx];
      
      // Flatten all checkpoints from all days
      const allCheckpoints = [];
      route.days.forEach(day => {
        day.checkpoints.forEach(cp => {
          allCheckpoints.push(cp);
        });
      });
      
      const activeCheckpoints = allCheckpoints.filter((_, i) => selectedCheckpoints[i]);
      
      let aiNotes = `AI Suggested Itinerary:\n\nRoute: ${route.title}\n`;
      aiNotes += `${route.description}\n\n`;
      
      route.days.forEach(day => {
        aiNotes += `### ${day.day} (${day.date})\n`;
        day.checkpoints.forEach((cp, i) => {
          // find original index to see if active
          const origIdx = allCheckpoints.indexOf(cp);
          if (selectedCheckpoints[origIdx]) {
            aiNotes += `- **${cp.name}**\n`;
            aiNotes += `  - Arrive: ${cp.arrivalTime} | Depart: ${cp.departureTime}\n`;
            aiNotes += `  - Places to Visit: ${cp.placesToVisit}\n`;
            if (cp.isOvernightHalt) {
              aiNotes += `  - 🛏️ *Overnight Halt*\n`;
            }
          }
        });
        aiNotes += `\n`;
      });
      aiNotes += `### Destination: ${destQuery}\n`;
      aiNotes += `- Arrive: ${route.destinationArrivalTime}\n`;
      aiNotes += `- Places to Visit: ${route.destinationPlacesToVisit}\n`;

      // Geocode source and dest
      const srcCoords = await geocodeLocation(sourceQuery);
      const destCoords = await geocodeLocation(destQuery);

      // Geocode checkpoints
      const checkpointData = await Promise.all(activeCheckpoints.map(async (cp, i) => {
        const coords = await geocodeLocation(cp.name);
        return {
          name: cp.name,
          lat: coords.lat,
          lon: coords.lon,
          order_idx: i + 1
        };
      }));

      const tripEndDate = route.days.length > 0 ? route.days[route.days.length - 1].date : startDateTime.split('T')[0];
      const tripStartDate = startDateTime.split('T')[0];

      const payload = {
        login_id: user.login_id,
        title: `${sourceQuery} to ${destQuery} AI Trip`,
        source_name: sourceQuery,
        source_lat: srcCoords.lat,
        source_lon: srcCoords.lon,
        dest_name: destQuery,
        dest_lat: destCoords.lat,
        dest_lon: destCoords.lon,
        start_date: tripStartDate,
        end_date: tripEndDate,
        description: aiNotes,
        checkpoints: checkpointData
      };

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        onViewTrip(data.trip_id);
      } else {
        throw new Error(data.message || data.detail || 'Failed to create trip');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create trip: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="ai-trip-container">
      <div className="ai-trip-header">
        <button className="round-icon-btn" onClick={step === 1 ? onBack : () => setStep(step - 1)}>⬅</button>
        <h2>✨ AI Trip Planner</h2>
      </div>

      {error && <div className="ai-error">{error}</div>}

      {loading && (
        <div className="ai-loading-container">
          <div className="ai-spinner">✨</div>
          <h3>Consulting the AI Oracles...</h3>
          <p>Designing your perfect road trip!</p>
        </div>
      )}

      {!loading && step === 1 && (
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3>Where do you want to go?</h3>
          <div className="ai-form-group relative">
            <label>Source City</label>
            <input 
              type="text" 
              placeholder="e.g. Pune" 
              value={sourceQuery} 
              onChange={e => { setSourceQuery(e.target.value); searchLocation(e.target.value, setSourceSuggestions); }} 
            />
            {sourceSuggestions.length > 0 && (
              <ul className="autocomplete-dropdown glass-panel" style={{position: 'absolute', zIndex: 10, width: '100%', listStyle: 'none', padding: 0, margin: '5px 0 0 0', maxHeight: '200px', overflowY: 'auto'}}>
                {sourceSuggestions.map((loc, i) => (
                  <li key={i} style={{padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)'}} onClick={() => { setSourceQuery(loc.name); setSourceSuggestions([]); }}>
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="ai-form-group relative">
            <label>Destination City</label>
            <input 
              type="text" 
              placeholder="e.g. Jaipur" 
              value={destQuery} 
              onChange={e => { setDestQuery(e.target.value); searchLocation(e.target.value, setDestSuggestions); }} 
            />
            {destSuggestions.length > 0 && (
              <ul className="autocomplete-dropdown glass-panel" style={{position: 'absolute', zIndex: 10, width: '100%', listStyle: 'none', padding: 0, margin: '5px 0 0 0', maxHeight: '200px', overflowY: 'auto'}}>
                {destSuggestions.map((loc, i) => (
                  <li key={i} style={{padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)'}} onClick={() => { setDestQuery(loc.name); setDestSuggestions([]); }}>
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="ai-form-group">
            <label>Start Date & Time</label>
            <input 
              type="datetime-local" 
              value={startDateTime} 
              onChange={e => setStartDateTime(e.target.value)} 
            />
          </div>
          <div className="ai-actions">
            <button className="ai-magic-btn" onClick={generateTripPlan}>
              🪄 Generate Routes
            </button>
          </div>
        </div>
      )}

      {!loading && step === 2 && (
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3>Select a Route</h3>
          <p>I found a few ways to get to {destQuery}. Which one sounds best?</p>
          
          <div style={{ marginTop: '20px' }}>
            {routes.map((route, idx) => (
              <div 
                key={idx} 
                className={`ai-route-option ${selectedRouteIdx === idx ? 'selected' : ''}`}
                onClick={() => handleRouteSelect(idx)}
              >
                <h4 className="ai-route-title">{route.title}</h4>
                <p style={{ margin: '0 0 10px 0', opacity: 0.8 }}>{route.description}</p>
                <div className="ai-checkpoint-list">
                  {route.days.map((day, didx) => (
                    <React.Fragment key={didx}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6, alignSelf: 'center', margin: '0 5px' }}>{day.day}</span>
                      {day.checkpoints.map((cp, cidx) => (
                        <span key={`${didx}-${cidx}`} className="ai-checkpoint-tag" style={{ border: cp.isOvernightHalt ? '1px solid #ec4899' : 'none' }}>
                          {cp.name} {cp.isOvernightHalt && '🛏️'}
                        </span>
                      ))}
                    </React.Fragment>
                  ))}
                  <span style={{ fontSize: '0.8rem', opacity: 0.6, alignSelf: 'center', margin: '0 5px' }}>➔</span>
                  <span className="ai-checkpoint-tag" style={{ background: 'rgba(168, 85, 247, 0.2)' }}>{destQuery}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Not quite right? Give feedback!</h4>
            <textarea 
              className="ai-form-group"
              style={{ width: '100%', minHeight: '80px', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              placeholder="e.g. Add a stop in Mumbai, I prefer driving less per day, change the hotel stop..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button className="ai-magic-btn" style={{ marginTop: '10px', fontSize: '0.9rem', padding: '8px 16px' }} onClick={() => generateTripPlan(true)}>
              🔄 Revise Plan
            </button>
          </div>
        </div>
      )}

      {!loading && step === 3 && (
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3>Customize Your Journey</h3>
          <p>Uncheck any stops you want to skip. We've included some must-see places at each stop!</p>
          
          <div style={{ marginTop: '20px' }}>
            {(() => {
              const route = routes[selectedRouteIdx];
              let globalCpIndex = 0;
              return route.days.map((day, didx) => (
                <div key={didx} style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#ec4899', margin: '0 0 15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                    📅 {day.day} ({day.date})
                  </h4>
                  {day.checkpoints.map((cp, cidx) => {
                    const currentIdx = globalCpIndex++;
                    return (
                      <div key={currentIdx} className="ai-checkpoint-item" style={{ opacity: selectedCheckpoints[currentIdx] ? 1 : 0.5 }}>
                        <input 
                          type="checkbox" 
                          className="ai-checkpoint-checkbox"
                          checked={selectedCheckpoints[currentIdx]} 
                          onChange={() => toggleCheckpoint(currentIdx)} 
                        />
                        <div className="ai-checkpoint-content" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{cp.name} {cp.isOvernightHalt && <span title="Overnight Halt">🛏️</span>}</h4>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8, textAlign: 'right', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                              ↓ {cp.arrivalTime} <br/> ↑ {cp.departureTime}
                            </div>
                          </div>
                          <div className="ai-places">✨ Visit: {cp.placesToVisit}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
            
            <div className="ai-checkpoint-item" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ width: '18px' }}>📍</div>
              <div className="ai-checkpoint-content" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{destQuery} (Destination)</h4>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, textAlign: 'right', background: 'rgba(168, 85, 247, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                    ↓ {routes[selectedRouteIdx].destinationArrivalTime}
                  </div>
                </div>
                <div className="ai-places">✨ Visit: {routes[selectedRouteIdx].destinationPlacesToVisit}</div>
              </div>
            </div>
          </div>

          <div className="ai-actions">
            <button className="ai-magic-btn" onClick={createTrip}>
              🚀 Create Trip Automatically
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
