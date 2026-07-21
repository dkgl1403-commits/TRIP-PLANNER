import React, { useState, useEffect } from 'react';
import './CreateTrip.css';
import TripMap from './TripMap';

export default function CreateTrip({ user, onBack }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [sourceQuery, setSourceQuery] = useState('');
  const [source, setSource] = useState(null);
  const [sourceSuggestions, setSourceSuggestions] = useState([]);

  const [destQuery, setDestQuery] = useState('');
  const [destination, setDestination] = useState(null);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [checkpoints, setCheckpoints] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [personQuery, setPersonQuery] = useState('');
  const [personResults, setPersonResults] = useState([]);
  const personSearchRef = React.useRef(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Close person search dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (personSearchRef.current && !personSearchRef.current.contains(event.target)) {
        setPersonResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const fetchUsers = async () => {
      if (personQuery.trim().length < 2) {
        setPersonResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(personQuery)}&login_id=${user?.login_id || ''}`);
        const data = await res.json();
        setPersonResults(data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [personQuery, user]);

  const searchTimerRef = React.useRef(null);
  const searchLocation = (query, setSuggestions) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    // Debounce: wait 300ms after user stops typing
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      try {
        // Photon with India center bias for better autocomplete
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=7&lat=22.0&lon=78.5&location_bias_scale=0.6&lang=en`);
        const data = await res.json();
        const results = data.features
          .filter(f => {
            // Prefer Indian results but don't hard-block others
            const country = (f.properties.country || '').toLowerCase();
            return country === 'india' || country === '';
          })
          .slice(0, 6)
          .map(f => {
            const p = f.properties;
            const parts = [p.name || '', p.city || p.town || p.village || '', p.district || p.county || '', p.state || ''].filter(Boolean);
            // Remove duplicates in parts (e.g. "Jaipur, Jaipur, Rajasthan" → "Jaipur, Rajasthan")
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

  const handleSelectSource = (loc) => {
    setSource(loc);
    setSourceQuery(loc.name);
    setSourceSuggestions([]);
  };

  const handleSelectDest = (loc) => {
    setDestination(loc);
    setDestQuery(loc.name);
    setDestSuggestions([]);
  };

  const addCheckpoint = () => {
    if (checkpoints.length < 10) {
      setCheckpoints([...checkpoints, { query: '', name: '', lat: null, lon: null, suggestions: [], order_idx: checkpoints.length + 1 }]);
    }
  };

  const updateCheckpointQuery = (index, value) => {
    const updated = [...checkpoints];
    updated[index].query = value;
    updated[index].name = '';
    updated[index].lat = null;
    updated[index].lon = null;
    setCheckpoints(updated);
    
    // Slight hack for async state updates for suggestions:
    // We can call searchLocation but pass a specific setter
    searchLocation(value, (suggs) => {
      setCheckpoints(prev => {
        const p = [...prev];
        if (p[index]) p[index].suggestions = suggs;
        return p;
      });
    });
  };

  const handleSelectCheckpoint = (index, loc) => {
    const updated = [...checkpoints];
    updated[index].query = loc.name;
    updated[index].name = loc.name;
    updated[index].lat = loc.lat;
    updated[index].lon = loc.lon;
    updated[index].suggestions = [];
    setCheckpoints(updated);
  };

  const removeCheckpoint = (index) => {
    const updated = [...checkpoints];
    updated.splice(index, 1);
    updated.forEach((cp, i) => cp.order_idx = i + 1);
    setCheckpoints(updated);
  };

  const addPersonParticipant = (person) => {
    if (participants.some(p => p.name === person.name)) return;
    setParticipants([...participants, { name: person.name, mobile: person.phone || '', email: '' }]);
    setPersonQuery('');
    setPersonResults([]);
  };

  const removeParticipant = (index) => {
    const updated = [...participants];
    updated.splice(index, 1);
    setParticipants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!title || !source || !destination || !startDate || !endDate) {
      setErrorMsg("Please fill in all mandatory fields (Title, Source, Destination, Dates).");
      return;
    }

    const payload = {
      login_id: user.login_id || 'guest',
      title,
      source_name: source.name,
      source_lat: source.lat,
      source_lon: source.lon,
      dest_name: destination.name,
      dest_lat: destination.lat,
      dest_lon: destination.lon,
      start_date: startDate,
      end_date: endDate,
      checkpoints: checkpoints,
      participants: participants.filter(p => p.name.trim() !== '')
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          onBack(); // Return to dashboard
        }, 2000);
      } else {
        setErrorMsg(data.detail || "Failed to create trip.");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-trip-container">
      <div className="form-panel glass-panel">
        <div className="form-header" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <button 
            className="round-icon-btn" 
            title="Back to Dashboard"
            onClick={onBack}
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
          >⬅</button>
          <h2 style={{ margin: 0 }}>Plan a New Trip</h2>
        </div>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="trip-form">
          <div className="input-group">
            <label>Trip Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer in Paris" required />
          </div>

          <div className="location-inputs">
            <div className="input-group relative">
              <label>Source Location</label>
              <input 
                type="text" 
                value={sourceQuery} 
                onChange={e => {
                  setSourceQuery(e.target.value);
                  setSource(null);
                  searchLocation(e.target.value, setSourceSuggestions);
                }} 
                placeholder="Search starting point..." 
                required 
              />
              {sourceSuggestions.length > 0 && (
                <ul className="autocomplete-dropdown glass-panel">
                  {sourceSuggestions.map((loc, i) => (
                    <li key={i} onClick={() => handleSelectSource(loc)}>{loc.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="input-group relative">
              <label>Destination Location</label>
              <input 
                type="text" 
                value={destQuery} 
                onChange={e => {
                  setDestQuery(e.target.value);
                  setDestination(null);
                  searchLocation(e.target.value, setDestSuggestions);
                }} 
                placeholder="Search destination..." 
                required 
              />
              {destSuggestions.length > 0 && (
                <ul className="autocomplete-dropdown glass-panel">
                  {destSuggestions.map((loc, i) => (
                    <li key={i} onClick={() => handleSelectDest(loc)}>{loc.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="checkpoints-list">
            {checkpoints.length > 0 && <label style={{marginTop: '10px', display: 'block'}}>Route Checkpoints</label>}
            {checkpoints.map((cp, idx) => (
              <div key={idx} className="input-group relative" style={{marginTop: '10px'}}>
                <div style={{display: 'flex', gap: '10px'}}>
                  <input 
                    type="text" 
                    value={cp.query} 
                    onChange={e => updateCheckpointQuery(idx, e.target.value)} 
                    placeholder={`Checkpoint ${idx + 1}...`}
                  />
                  <button type="button" className="remove-btn" onClick={() => removeCheckpoint(idx)}>❌</button>
                </div>
                {cp.suggestions && cp.suggestions.length > 0 && (
                  <ul className="autocomplete-dropdown glass-panel">
                    {cp.suggestions.map((loc, i) => (
                      <li key={i} onClick={() => handleSelectCheckpoint(idx, loc)}>{loc.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {checkpoints.length < 10 && (
              <button type="button" className="add-participant-btn" style={{marginTop: '10px'}} onClick={addCheckpoint}>
                + Add Checkpoint
              </button>
            )}
          </div>

          <div className="date-inputs row" style={{marginTop: '20px'}}>
            <div className="input-group">
              <label>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
          </div>

          <div className="section-divider"></div>
          
          <h3>Participants</h3>
          <p className="sub-text">Add registered users to your trip.</p>
          
          <div className="participants-list" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {participants.map((p, idx) => (
                <div key={idx} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'white' }}>{p.name}</span>
                  <button type="button" onClick={() => removeParticipant(idx)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: 0 }}>&times;</button>
                </div>
              ))}
            </div>

            {participants.length < 30 && (
              <div style={{ position: 'relative' }} ref={personSearchRef}>
                <input
                  type="text"
                  placeholder="Search registered users..."
                  value={personQuery}
                  onChange={e => setPersonQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', boxSizing: 'border-box' }}
                />
                {personResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginTop: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                    {personResults.map(person => (
                      <div key={person.login_id} onClick={() => addPersonParticipant(person)} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{person.name}</span>
                        <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{person.phone}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary submit-trip-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : '🚀 Create Trip'}
            </button>
          </div>
        </form>
      </div>

      <div className="map-panel glass-panel">
        <TripMap source={source} destination={destination} checkpoints={checkpoints} />
      </div>
    </div>
  );
}
