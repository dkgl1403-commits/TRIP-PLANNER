import React, { useState } from 'react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function AiCreateTrip({ user, onBack, onViewTrip }) {
  const [step, setStep] = useState(1);
  const [sourceQuery, setSourceQuery] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destQuery, setDestQuery] = useState('');
  const [destSuggestions, setDestSuggestions] = useState([]);
  
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
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
    if (!sourceQuery || !destQuery || !startDate) {
      setError('Please enter source, destination, and start date.');
      return;
    }
    
    setLoading(true);
    setError(null);
    

    let favoritesText = "";
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        const locRes = await fetch(`/api/locations?login_id=${encodeURIComponent(userObj.login_id)}`);
        if (locRes.ok) {
          const locData = await locRes.json();
          if (locData.locations && locData.locations.length > 0) {
            const favoritesList = locData.locations.map(l => `${l.name} (${l.city || ''}, ${l.state || ''})`).join(', ');
            favoritesText = `\n10. FAVORITE LOCATIONS: The user has these saved/favorite locations: [${favoritesList}]. If any of these locations naturally fall along or near the route, you MUST include them as checkpoints!`;
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch favorite locations", e);
    }

    let roundTripInstruction = isRoundTrip ? 
      `\n- The user requested a ROUND TRIP. You MUST ensure the final destination on the last day is back to the original source city: ${sourceQuery}.` : '';

    let prompt = `You are an expert travel planner. The user wants to travel from ${sourceQuery} to ${destQuery} by road.
They are starting on ${startDate}. The trip should last for exactly ${numberOfDays} days.${roundTripInstruction}

Provide 2 distinct route options. For each route, break the journey down into a day-by-day itinerary (Day 1 to Day ${numberOfDays}).
CRITICAL RULES:
1. Provide checkpoints every 150-200 kms. Checkpoints MUST lie directly on or within 10-30 km of the primary highway route.
2. Give preference to National Highways (NH), then State highways. Ensure routes are passable by a 4-wheeler.
3. Calculate realistic driving times between checkpoints, factoring in average traffic and rest breaks.
4. Include the estimated Arrival Time and Departure Time for each checkpoint.
5. ALWAYS start the trip from the source city at exactly 08:00 AM in the morning on Day 1. Subsequent days can start as appropriate.
6. If driving time exceeds 8-10 hours in a single day, or if it gets too late, schedule an overnight halt at a major city/checkpoint, and resume the journey on the next Day.
7. Plan the itinerary strictly within the ${numberOfDays} days.
8. Provide 2-3 suggestive places to visit for each checkpoint and the final destination. Ensure the city is a prominent tourist attraction with good restaurants.
9. Suggested overnight stays MUST have good 3 to 5-star hotels available.
10. VERY IMPORTANT: When naming checkpoints or destinations, provide the fully qualified name including State and Country (e.g., "Surat, Gujarat, India").${favoritesText}

Return ONLY a valid JSON object strictly matching this format without any markdown wrappers (like \`\`\`json):`;


    if (isFeedback && routes.length > 0) {
      prompt = `You previously generated this JSON itinerary:\n${JSON.stringify({routes})}\n\nThe user provided this feedback to revise the plan: "${feedback}"\n\nBased on this feedback, completely regenerate the JSON itinerary following all the CRITICAL RULES below, but incorporating the user's feedback.\n\nCRITICAL RULES:\n1. Checkpoints MUST lie directly on or within 10-30 km of the primary highway route.\n2. Give preference to National Highways (NH), then State highways.\n3. Provide checkpoints every 150-200 kms.\n4. Calculate realistic driving times.\n5. ALWAYS start the trip from the source city at exactly 08:00 AM on Day 1.\n6. Plan the itinerary strictly within the ${numberOfDays} days.${roundTripInstruction}\n7. If driving time exceeds 8-10 hours in a single day, schedule an overnight halt.\n8. Provide 2-3 suggestive places to visit.\n9. Suggested overnight stays MUST have good 3 to 5-star hotels available.\n10. VERY IMPORTANT: When naming checkpoints or destinations, provide the fully qualified name including State and Country.${favoritesText}\n\nReturn ONLY a valid JSON object strictly matching this format without any markdown wrappers (like \`\`\`json):`;
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

    const models = [
      "gemini-3.5-flash",
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash-lite",
      "gemma-4-26b-a4b-it"
    ];
    let success = false;
    let lastError = null;

    for (const model of models) {
      if (success) break;
      
      try {
        console.log(`Trying model: ${model}...`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt + '\n' + format }] }],
            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(`[${model}] ` + (data.error?.message || 'Failed to generate trip'));
        
        let aiResponseText = data.candidates[0].content.parts[0].text;
        
        const parsedData = JSON.parse(aiResponseText);
        setRoutes(parsedData.routes);
        setStep(2);
        success = true;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed. Switching to next model...`, err.message);
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
      // Use photon for better fuzzy matching (e.g. if AI hallucinates the wrong state for a city)
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        return { lat: data.features[0].geometry.coordinates[1], lon: data.features[0].geometry.coordinates[0] };
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

      const tripEndDate = route.days.length > 0 ? route.days[route.days.length - 1].date : startDate;
      const tripStartDate = startDate;

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
        checkpoints: checkpointData,
        participants: [{
          name: user.name || user.login_id,
          email: user.email || '',
          mobile: user.phone || '',
          login_id: user.login_id
        }]
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
    <div className="w-full min-h-screen flex flex-col pt-24 px-4 sm:px-8 max-w-4xl mx-auto text-on-surface font-body-md pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container border border-glass-stroke text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
          onClick={step === 1 ? onBack : () => setStep(step - 1)}
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </button>
        <h2 className="font-display-lg text-3xl font-bold m-0 flex items-center gap-3">
          <span className="text-neon-coral material-symbols-outlined text-[32px]">auto_awesome</span>
          AI Trip Planner
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-glass-fill backdrop-blur-md border border-glass-stroke rounded-2xl shadow-xl min-h-[400px]">
          <div className="w-16 h-16 border-4 border-neon-coral border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="font-headline-lg text-2xl font-bold mb-2">Consulting the AI Oracles...</h3>
          <p className="font-body-md text-on-surface-variant">Designing your perfect road trip!</p>
        </div>
      )}

      {!loading && step === 1 && (
        <div className="p-8 rounded-2xl bg-glass-fill backdrop-blur-[24px] border border-glass-stroke shadow-2xl flex flex-col gap-6">
          <h3 className="font-headline-lg text-2xl font-bold border-b border-glass-stroke pb-4 m-0">Where do you want to go?</h3>
          
          <div className="flex flex-col gap-2 relative">
            <label className="font-label-md text-on-surface-variant uppercase tracking-wider">Source City</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-glass-stroke focus:border-neon-coral focus:ring-1 focus:ring-neon-coral outline-none transition-all font-body-lg text-on-surface"
              placeholder="e.g. Pune" 
              value={sourceQuery} 
              onChange={e => { setSourceQuery(e.target.value); searchLocation(e.target.value, setSourceSuggestions); }} 
            />
            {sourceSuggestions.length > 0 && (
              <ul className="absolute top-[100%] left-0 w-full mt-2 bg-surface-container-high border border-glass-stroke rounded-xl shadow-2xl max-h-[200px] overflow-y-auto z-50 p-2">
                {sourceSuggestions.map((loc, i) => (
                  <li 
                    key={i} 
                    className="px-4 py-3 rounded-lg hover:bg-surface-variant cursor-pointer text-on-surface font-body-md transition-colors"
                    onClick={() => { setSourceQuery(loc.name); setSourceSuggestions([]); }}
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="flex flex-col gap-2 relative">
            <label className="font-label-md text-on-surface-variant uppercase tracking-wider">Destination City</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-glass-stroke focus:border-neon-coral focus:ring-1 focus:ring-neon-coral outline-none transition-all font-body-lg text-on-surface"
              placeholder="e.g. Jaipur" 
              value={destQuery} 
              onChange={e => { setDestQuery(e.target.value); searchLocation(e.target.value, setDestSuggestions); }} 
            />
            {destSuggestions.length > 0 && (
              <ul className="absolute top-[100%] left-0 w-full mt-2 bg-surface-container-high border border-glass-stroke rounded-xl shadow-2xl max-h-[200px] overflow-y-auto z-50 p-2">
                {destSuggestions.map((loc, i) => (
                  <li 
                    key={i} 
                    className="px-4 py-3 rounded-lg hover:bg-surface-variant cursor-pointer text-on-surface font-body-md transition-colors"
                    onClick={() => { setDestQuery(loc.name); setDestSuggestions([]); }}
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface-variant uppercase tracking-wider">Start Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-glass-stroke focus:border-neon-coral focus:ring-1 focus:ring-neon-coral outline-none transition-all font-body-lg text-on-surface"
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface-variant uppercase tracking-wider">Duration (Days)</label>
              <input 
                type="number" 
                min="1"
                max="30"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-glass-stroke focus:border-neon-coral focus:ring-1 focus:ring-neon-coral outline-none transition-all font-body-lg text-on-surface"
                value={numberOfDays} 
                onChange={e => setNumberOfDays(parseInt(e.target.value) || 1)} 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-2 p-4 rounded-xl bg-surface-container border border-glass-stroke">
            <input 
              type="checkbox" 
              id="roundTripCheck"
              checked={isRoundTrip}
              onChange={e => setIsRoundTrip(e.target.checked)}
              className="w-5 h-5 rounded border-glass-stroke text-neon-coral focus:ring-neon-coral focus:ring-offset-surface bg-surface"
            />
            <label htmlFor="roundTripCheck" className="cursor-pointer font-title-md select-none text-on-surface-variant">
              This is a Round Trip (return to source)
            </label>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-neon-coral to-[#E05236] text-surface font-title-md font-bold hover:shadow-[0_4px_20px_rgba(255,107,74,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
              onClick={generateTripPlan}
            >
              <span className="material-symbols-outlined">auto_awesome</span> 
              Generate Routes
            </button>
          </div>
        </div>
      )}

      {!loading && step === 2 && (
        <div className="flex flex-col gap-8">
          <div className="p-8 rounded-2xl bg-glass-fill backdrop-blur-[24px] border border-glass-stroke shadow-2xl flex flex-col gap-6">
            <div>
              <h3 className="font-headline-lg text-2xl font-bold m-0">Select a Route</h3>
              <p className="font-body-md text-on-surface-variant mt-2">I found a few ways to get to {destQuery}. Which one sounds best?</p>
            </div>
            
            <div className="flex flex-col gap-4">
              {routes.map((route, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-xl border-2 transition-all cursor-pointer shadow-lg flex flex-col gap-4
                    ${selectedRouteIdx === idx ? 'border-neon-coral bg-neon-coral/5' : 'border-glass-stroke bg-surface-container hover:border-neon-coral/50'}`}
                  onClick={() => handleRouteSelect(idx)}
                >
                  <div>
                    <h4 className="font-title-lg font-bold text-on-surface">{route.title}</h4>
                    <p className="font-body-md text-on-surface-variant mt-1">{route.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {route.days.map((day, didx) => (
                      <React.Fragment key={didx}>
                        <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">{day.day}</span>
                        {day.checkpoints.map((cp, cidx) => (
                          <span key={`${didx}-${cidx}`} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 ${cp.isOvernightHalt ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-surface-variant text-on-surface-variant border border-glass-stroke'}`}>
                            {cp.name} {cp.isOvernightHalt && <span className="material-symbols-outlined text-[14px]">bed</span>}
                          </span>
                        ))}
                      </React.Fragment>
                    ))}
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant mx-1">arrow_forward</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {destQuery}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-surface-container border border-glass-stroke shadow-xl flex flex-col gap-4">
            <h4 className="font-title-md font-bold m-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-neon-coral">chat</span>
              Not quite right? Give feedback!
            </h4>
            <textarea 
              className="w-full min-h-[100px] p-4 rounded-xl bg-glass-fill border border-glass-stroke focus:border-neon-coral focus:ring-1 focus:ring-neon-coral outline-none transition-all font-body-md text-on-surface resize-y"
              placeholder="e.g. Add a stop in Mumbai, I prefer driving less per day, change the hotel stop..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button 
                className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-title-sm font-bold border border-glass-stroke hover:bg-surface-variant transition-colors flex items-center gap-2"
                onClick={() => generateTripPlan(true)}
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Revise Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && step === 3 && (
        <div className="p-8 rounded-2xl bg-glass-fill backdrop-blur-[24px] border border-glass-stroke shadow-2xl flex flex-col gap-8">
          <div className="border-b border-glass-stroke pb-6">
            <h3 className="font-headline-lg text-2xl font-bold m-0">Customize Your Journey</h3>
            <p className="font-body-md text-on-surface-variant mt-2">Uncheck any stops you want to skip. We've included some must-see places at each stop!</p>
          </div>
          
          <div className="flex flex-col gap-8">
            {(() => {
              const route = routes[selectedRouteIdx];
              let globalCpIndex = 0;
              return route.days.map((day, didx) => (
                <div key={didx} className="flex flex-col gap-4">
                  <h4 className="font-title-md font-bold text-pink-400 m-0 flex items-center gap-2">
                    <span className="material-symbols-outlined">calendar_month</span>
                    {day.day} <span className="font-body-sm opacity-70">({day.date})</span>
                  </h4>
                  
                  <div className="flex flex-col gap-3">
                    {day.checkpoints.map((cp, cidx) => {
                      const currentIdx = globalCpIndex++;
                      const isSelected = selectedCheckpoints[currentIdx];
                      return (
                        <div 
                          key={currentIdx} 
                          className={`flex gap-4 p-4 rounded-xl border transition-all ${isSelected ? 'bg-surface-container border-glass-stroke' : 'bg-surface/50 border-transparent opacity-50 grayscale'}`}
                        >
                          <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 rounded border-glass-stroke text-neon-coral focus:ring-neon-coral cursor-pointer"
                            checked={isSelected} 
                            onChange={() => toggleCheckpoint(currentIdx)} 
                          />
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-title-md font-bold m-0 flex items-center gap-2">
                                {cp.name} 
                                {cp.isOvernightHalt && <span className="text-pink-400 flex items-center gap-1 text-sm bg-pink-500/10 px-2 py-0.5 rounded"><span className="material-symbols-outlined text-[16px]">bed</span> Overnight</span>}
                              </h4>
                              <div className="flex flex-col items-end text-xs font-mono text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-lg border border-glass-stroke">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">flight_land</span> {cp.arrivalTime}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">flight_takeoff</span> {cp.departureTime}</span>
                              </div>
                            </div>
                            <div className="font-body-sm text-on-surface-variant flex items-start gap-2 bg-surface-container-low p-3 rounded-lg border border-glass-stroke/50">
                              <span className="material-symbols-outlined text-[16px] text-yellow-400 mt-0.5">star</span> 
                              <span><strong className="text-on-surface">Visit:</strong> {cp.placesToVisit}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
            
            {/* Destination Node */}
            <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-glass-stroke">
              <h4 className="font-title-md font-bold text-purple-400 m-0 flex items-center gap-2">
                <span className="material-symbols-outlined">flag</span>
                Final Destination
              </h4>
              <div className="flex gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <div className="w-5 flex justify-center mt-1">
                  <span className="material-symbols-outlined text-purple-400">location_on</span>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-title-md font-bold m-0">{destQuery}</h4>
                    <div className="flex flex-col items-end text-xs font-mono text-purple-300 bg-purple-900/40 px-3 py-1.5 rounded-lg">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">flight_land</span> {routes[selectedRouteIdx].destinationArrivalTime}</span>
                    </div>
                  </div>
                  <div className="font-body-sm text-purple-200/80 flex items-start gap-2 bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                    <span className="material-symbols-outlined text-[16px] text-yellow-400 mt-0.5">star</span> 
                    <span><strong className="text-purple-100">Visit:</strong> {routes[selectedRouteIdx].destinationPlacesToVisit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-glass-stroke flex justify-end">
            <button 
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-neon-coral to-[#E05236] text-surface font-title-md font-bold hover:shadow-[0_4px_20px_rgba(255,107,74,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
              onClick={createTrip}
            >
              <span className="material-symbols-outlined">rocket_launch</span> 
              Create Trip Automatically
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
