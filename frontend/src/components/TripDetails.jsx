import React, { useState, useEffect } from 'react';
import './CreateTrip.css'; // Re-use the styling from Create Trip for consistency
import TripMap from './TripMap';

export default function TripDetails({ tripId, onBack, user }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false);
  
  // Navigation mode
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Live Map Mode States
  const [liveLocations, setLiveLocations] = useState([]);
  const [myLocation, setMyLocation] = useState(null);

  // Form states for edit mode
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trips/${tripId}`);
      const data = await res.json();
      if (res.ok) {
        setTrip(data.trip);
      } else {
        setErrorMsg(data.detail || "Failed to load trip");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveLocations = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/live`);
      const data = await res.json();
      if (res.ok) {
        setLiveLocations(data.locations);
      }
    } catch (err) {
      console.error("Failed to fetch live locations", err);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  // Live Location broadcasting if trip is in progress
  useEffect(() => {
    let interval;
    if (trip && trip.status === 'In Progress') {
      fetchLiveLocations(); // initial fetch

      if ("geolocation" in navigator) {
        interval = setInterval(() => {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setMyLocation({ lat: latitude, lon: longitude });
            
            // Push to backend
            try {
              await fetch(`/api/trips/${tripId}/location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  login_id: user?.login_id,
                  lat: latitude,
                  lon: longitude
                })
              });
            } catch (e) {
              console.error("Failed to send location", e);
            }
          }, (error) => {
            console.error("Geolocation error: ", error);
          }, { enableHighAccuracy: true });
        }, 30000); // update every 30s automatically for self
      }
    }
    return () => clearInterval(interval);
  }, [trip, tripId, user]);

  const handleStartTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/start`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        fetchTrip();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.detail);
      }
    } catch (err) {
      setErrorMsg("Failed to start trip.");
    }
  };

  const handleCancelTrip = async () => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;
    try {
      const res = await fetch(`/api/trips/${tripId}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Trip Cancelled.");
        fetchTrip();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.detail);
      }
    } catch (err) {
      setErrorMsg("Failed to cancel trip.");
    }
  };

  const handleCheckin = async (participantName, orderIdx) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_name: participantName, checkpoint_order_idx: orderIdx })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        fetchTrip();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.detail);
      }
    } catch (err) {
      setErrorMsg("Failed to check in.");
    }
  };

  const handleEndTrip = async () => {
    if (!window.confirm("Are you sure you want to end this trip?")) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/trips/${tripId}/end`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ end_lat: latitude, end_lon: longitude })
          });
          const data = await res.json();
          if (res.ok) {
            setSuccessMsg("Trip Completed!");
            fetchTrip();
            setTimeout(() => setSuccessMsg(''), 3000);
          } else {
            setErrorMsg(data.detail);
          }
        } catch (err) {
          setErrorMsg("Failed to end trip.");
        }
      }, (error) => {
        setErrorMsg("Failed to get geolocation to end trip.");
      }, { enableHighAccuracy: true });
    } else {
      setErrorMsg("Geolocation is not supported by this browser.");
    }
  };

  // When entering edit mode, populate the form
  useEffect(() => {
    if (isEditing && trip) {
      setTitle(trip.title);
      setStartDate(trip.start_date);
      setEndDate(trip.end_date);
      setSource(trip.source);
      setSourceQuery(trip.source.name);
      setDestination(trip.destination);
      setDestQuery(trip.destination.name);
      
      const cp = (trip.checkpoints || []).map(c => ({
        query: c.name, name: c.name, lat: c.lat, lon: c.lon, suggestions: [], order_idx: c.order_idx
      }));
      setCheckpoints(cp);
      
      const pts = (trip.participants || []).length > 0 
        ? [...trip.participants] 
        : [{ name: '', mobile: '', email: '' }];
      setParticipants(pts);
    }
  }, [isEditing, trip]);

  // Autocomplete logic
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

  const handleSelectSource = (loc) => { setSource(loc); setSourceQuery(loc.name); setSourceSuggestions([]); };
  const handleSelectDest = (loc) => { setDestination(loc); setDestQuery(loc.name); setDestSuggestions([]); };

  const addCheckpoint = () => { if (checkpoints.length < 10) setCheckpoints([...checkpoints, { query: '', name: '', lat: null, lon: null, suggestions: [], order_idx: checkpoints.length + 1 }]); };
  const updateCheckpointQuery = (index, value) => {
    const updated = [...checkpoints];
    updated[index].query = value; updated[index].name = ''; updated[index].lat = null; updated[index].lon = null;
    setCheckpoints(updated);
    searchLocation(value, (suggs) => {
      setCheckpoints(prev => { const p = [...prev]; if (p[index]) p[index].suggestions = suggs; return p; });
    });
  };
  const handleSelectCheckpoint = (index, loc) => {
    const updated = [...checkpoints];
    updated[index].query = loc.name; updated[index].name = loc.name; updated[index].lat = loc.lat; updated[index].lon = loc.lon; updated[index].suggestions = [];
    setCheckpoints(updated);
  };
  const removeCheckpoint = (index) => {
    const updated = [...checkpoints]; updated.splice(index, 1); updated.forEach((cp, i) => cp.order_idx = i + 1); setCheckpoints(updated);
  };

  const addParticipant = () => { if (participants.length < 30) setParticipants([...participants, { name: '', mobile: '', email: '' }]); };
  const updateParticipant = (index, field, value) => {
    const updated = [...participants]; updated[index][field] = value; setParticipants(updated);
  };
  const removeParticipant = (index) => {
    const updated = [...participants]; updated.splice(index, 1); setParticipants(updated);
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!title || !source || !destination || !startDate || !endDate) {
      setErrorMsg("Please fill in all mandatory fields.");
      return;
    }
    const payload = {
      login_id: user?.login_id || 'guest',
      title,
      source_name: source.name, source_lat: source.lat, source_lon: source.lon,
      dest_name: destination.name, dest_lat: destination.lat, dest_lon: destination.lon,
      start_date: startDate, end_date: endDate,
      cover_image_url: trip.cover_image_url,
      checkpoints: checkpoints,
      participants: participants.filter(p => p.name.trim() !== '')
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Trip updated successfully!");
        setIsEditing(false);
        fetchTrip(); // reload updated data
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.detail || "Failed to update trip.");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Trip Details...</div>;
  if (errorMsg && !isEditing) return <div className="alert alert-error">{errorMsg}</div>;
  if (!trip) return <div>Trip not found</div>;

  const isOwner = user?.login_id === trip.login_id;
  const isInProgress = trip.status === 'In Progress';
  const isPlanned = trip.status === 'Planned' || !trip.status;
  const isCancelled = trip.status === 'Cancelled';
  const isCompleted = trip.status === 'Completed';

  // Calculate straight-line distance between two lat/lon points
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const participantColors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

  return (
    <div className="create-trip-container">
      <div className="form-panel glass-panel" style={{position: 'relative'}}>
        {trip.cover_image_url && !isEditing && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '150px',
            backgroundImage: `url(${trip.cover_image_url})`, backgroundSize: 'cover', 
            borderRadius: '20px 20px 0 0', opacity: 0.3, zIndex: -1
          }}></div>
        )}
        
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          {/* Round action buttons - top corners */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <button 
              className="round-icon-btn" 
              title={isEditing ? 'Back to Details' : 'Back to Dashboard'}
              onClick={() => isEditing ? setIsEditing(false) : onBack()}
            >⬅</button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!isEditing && isOwner && isPlanned && (
                <>
                  <button className="round-icon-btn" title="Edit Trip" onClick={() => setIsEditing(true)}>✎</button>
                  <button className="round-icon-btn primary" title="Start Trip" onClick={handleStartTrip}>🚀</button>
                  <button className="round-icon-btn danger" title="Cancel Trip" onClick={handleCancelTrip}>❌</button>
                </>
              )}
              {!isEditing && isOwner && isInProgress && (
                <button className="round-icon-btn danger" title="End Trip" onClick={handleEndTrip}>🛑</button>
              )}
            </div>
          </div>
          {/* Title - centered, dynamic fit */}
          <h2 style={{
            textAlign: 'center', margin: '0', 
            fontSize: 'clamp(1rem, 4vw, 2rem)',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {isEditing ? 'Edit Trip' : trip.title}
          </h2>
          {/* Status - tiny centered text */}
          {!isEditing && (
            <p style={{
              textAlign: 'center', margin: '4px 0 0 0', fontSize: '0.7rem', letterSpacing: '1px',
              textTransform: 'uppercase', opacity: 0.7,
              color: isInProgress ? '#4ade80' : (isCancelled ? '#9ca3af' : (isCompleted ? '#93c5fd' : '#fbbf24'))
            }}>
              {trip.status || 'Planned'}
            </p>
          )}
        </div>

        {errorMsg && isEditing && <div className="alert alert-error">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {!isEditing ? (
          <div className="trip-summary" style={{marginTop: '20px'}}>
            
            {isCompleted && trip.end_lat && (
              <div style={{marginBottom: '20px', background: 'rgba(59, 130, 246, 0.15)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6'}}>
                <h3 style={{margin: 0, color: '#93c5fd', fontSize: '1rem'}}>✅ Trip Completed</h3>
                <p style={{fontSize: '0.85rem', marginTop: '5px', lineHeight: 1.6, opacity: 0.85}}>
                  <strong>Ended:</strong> {new Date(trip.actual_end_time).toLocaleString()}<br/>
                  <strong>Coordinates:</strong> {trip.end_lat.toFixed(4)}, {trip.end_lon.toFixed(4)}
                </p>
              </div>
            )}

            {/* Beautiful Participants List - MOVED TO TOP */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '18px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>👥 Participants ({trip.participants.length})</h3>
                {isInProgress && (
                  <button onClick={fetchLiveLocations} className="trip-detail-btn" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                    🔄 Refresh Locations
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {trip.participants.map((p, idx) => {
                  const color = participantColors[idx % participantColors.length];
                  const isMe = p.login_id === user?.login_id || (p.mobile && user?.phone && p.mobile === user.phone);
                  const liveLoc = liveLocations.find(l => l.name === p.name || l.login_id === p.login_id);
                  let distanceText = '';
                  if (isInProgress && myLocation && liveLoc) {
                    const dist = getDistanceKm(myLocation.lat, myLocation.lon, liveLoc.lat, liveLoc.lon);
                    distanceText = dist < 1 ? `${(dist * 1000).toFixed(0)} m away` : `${dist.toFixed(1)} km away`;
                  }
                  return (
                    <div key={idx} style={{
                      display: 'flex', flexDirection: 'column', gap: '8px',
                      background: isMe ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                      padding: '12px 16px', borderRadius: '12px', borderLeft: `4px solid ${color}`,
                      transition: 'background 0.2s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%', background: color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '1rem', color: 'white', flexShrink: 0
                        }}>
                          {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</span>
                            {isMe && <span style={{ background: '#3b82f6', color: 'white', padding: '1px 8px', borderRadius: '8px', fontSize: '0.7rem' }}>You</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '2px' }}>
                            {p.mobile && <span>📞 {p.mobile}</span>}
                            {p.mobile && p.email && <span> • </span>}
                            {p.email && <span>✉️ {p.email}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          {isInProgress && isMe && <span style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 600 }}>📍 0 km</span>}
                          {isInProgress && !isMe && distanceText && <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>📍 {distanceText}</span>}
                          {isInProgress && !isMe && !distanceText && <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>—</span>}
                          {liveLoc && <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '2px' }}>Updated {new Date(liveLoc.last_updated).toLocaleTimeString()}</div>}
                        </div>
                      </div>

                      {/* Progress Line */}
                      {(isInProgress || isCompleted) && (
                        <div style={{ marginTop: '4px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '10px', left: '20px', right: '20px', height: '2px', background: 'rgba(255,255,255,0.2)', zIndex: 0 }}></div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '4px', flex: 1 }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4ade80', border: '3px solid #1f2937' }}></div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>Start</span>
                            </div>

                            {trip.checkpoints?.map((cp) => {
                              const userCheckins = trip.checkins?.[p.name] || [];
                              const checkedIn = userCheckins.some(c => c.order_idx === cp.order_idx);
                              let canCheckIn = false;
                              if (isMe && isInProgress && myLocation && !checkedIn) {
                                const distToCp = getDistanceKm(myLocation.lat, myLocation.lon, cp.lat, cp.lon);
                                if (distToCp < 1.0) { // < 1 km
                                  canCheckIn = true;
                                }
                              }

                              return (
                                <div key={cp.order_idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '4px', flex: 1 }}>
                                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: checkedIn ? '#4ade80' : '#4b5563', border: '3px solid #1f2937' }}></div>
                                  <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>CP {cp.order_idx}</span>
                                  {canCheckIn && (
                                    <button 
                                      onClick={() => handleCheckin(p.name, cp.order_idx)}
                                      style={{ fontSize: '0.6rem', padding: '2px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '2px' }}
                                    >
                                      Check In
                                    </button>
                                  )}
                                </div>
                              );
                            })}

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '4px', flex: 1 }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isCompleted ? '#4ade80' : '#4b5563', border: '3px solid #1f2937' }}></div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>End</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {trip.participants.length === 0 && (
                  <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>No participants added yet.</p>
                )}
              </div>
            </div>

            {/* Route Overview - Compact & Beautiful */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', opacity: 0.9 }}>🗺️ Route Overview</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(59,130,246,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>📍 {trip.source.name}</span>
                {trip.checkpoints && trip.checkpoints.length > 0 && trip.checkpoints.map((cp, idx) => (
                  <React.Fragment key={idx}>
                    <span style={{ opacity: 0.5 }}>→</span>
                    <span style={{ background: 'rgba(245,158,11,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>📌 {cp.name}</span>
                  </React.Fragment>
                ))}
                <span style={{ opacity: 0.5 }}>→</span>
                <span style={{ background: 'rgba(16,185,129,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>🏁 {trip.destination.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '0.85rem', opacity: 0.7 }}>
                <span>📅 {trip.start_date} → {trip.end_date}</span>
                {trip.actual_start_time && <span style={{ color: '#4ade80' }}>🚀 Started: {new Date(trip.actual_start_time).toLocaleString()}</span>}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateTrip} className="trip-form">
            <div className="input-group">
              <label>Trip Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div className="location-inputs">
              <div className="input-group relative">
                <label>Source Location</label>
                <input type="text" value={sourceQuery} onChange={e => { setSourceQuery(e.target.value); setSource(null); searchLocation(e.target.value, setSourceSuggestions); }} required />
                {sourceSuggestions.length > 0 && (
                  <ul className="autocomplete-dropdown glass-panel">
                    {sourceSuggestions.map((loc, i) => <li key={i} onClick={() => handleSelectSource(loc)}>{loc.name}</li>)}
                  </ul>
                )}
              </div>
              <div className="input-group relative">
                <label>Destination Location</label>
                <input type="text" value={destQuery} onChange={e => { setDestQuery(e.target.value); setDestination(null); searchLocation(e.target.value, setDestSuggestions); }} required />
                {destSuggestions.length > 0 && (
                  <ul className="autocomplete-dropdown glass-panel">
                    {destSuggestions.map((loc, i) => <li key={i} onClick={() => handleSelectDest(loc)}>{loc.name}</li>)}
                  </ul>
                )}
              </div>
            </div>

            <div className="checkpoints-list">
              {checkpoints.length > 0 && <label style={{marginTop: '10px', display: 'block'}}>Route Checkpoints</label>}
              {checkpoints.map((cp, idx) => (
                <div key={idx} className="input-group relative" style={{marginTop: '10px'}}>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input type="text" value={cp.query} onChange={e => updateCheckpointQuery(idx, e.target.value)} placeholder={`Checkpoint ${idx + 1}...`} />
                    <button type="button" className="remove-btn" onClick={() => removeCheckpoint(idx)}>❌</button>
                  </div>
                  {cp.suggestions && cp.suggestions.length > 0 && (
                    <ul className="autocomplete-dropdown glass-panel">
                      {cp.suggestions.map((loc, i) => <li key={i} onClick={() => handleSelectCheckpoint(idx, loc)}>{loc.name}</li>)}
                    </ul>
                  )}
                </div>
              ))}
              {checkpoints.length < 10 && (
                <button type="button" className="add-participant-btn" style={{marginTop: '10px'}} onClick={addCheckpoint}>+ Add Checkpoint</button>
              )}
            </div>

            <div className="date-inputs row" style={{marginTop: '20px'}}>
              <div className="input-group"><label>Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required /></div>
              <div className="input-group"><label>End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required /></div>
            </div>

            <div className="section-divider"></div>
            <h3>Participants</h3>
            
            <div className="participants-list">
              {participants.map((p, idx) => (
                <div key={idx} className="participant-row">
                  <input type="text" placeholder="Name" value={p.name} onChange={e => updateParticipant(idx, 'name', e.target.value)} />
                  <input type="text" placeholder="Mobile" value={p.mobile} onChange={e => updateParticipant(idx, 'mobile', e.target.value)} />
                  <input type="email" placeholder="Email" value={p.email} onChange={e => updateParticipant(idx, 'email', e.target.value)} />
                  <button type="button" className="remove-btn" onClick={() => removeParticipant(idx)}>❌</button>
                </div>
              ))}
              {participants.length < 30 && <button type="button" className="add-participant-btn" onClick={addParticipant}>+ Add Person</button>}
            </div>

            <div className="form-actions" style={{marginTop: '20px'}}>
              <button type="submit" className="btn-primary submit-trip-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className={`map-panel glass-panel ${isFullscreen ? 'navigating-fullscreen' : ''}`} style={isFullscreen ? {position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, borderRadius: 0, margin: 0, padding: 0} : {position: 'relative'}}>
        {isInProgress && (
          <>
            <button 
              onClick={() => {
                if (!isNavigating && !("geolocation" in navigator)) {
                  alert("Geolocation is blocked or unsupported. A secure HTTPS connection or localhost is required.");
                  return;
                }
                setIsNavigating(!isNavigating);
              }}
              style={{
                position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
                background: isNavigating ? 'red' : 'blue', color: 'white', border: 'none', padding: '10px 20px',
                borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
              {isNavigating ? '❌ Exit Navigation' : '🧭 Start Navigation'}
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
                background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '10px 15px',
                borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
              {isFullscreen ? '⏬ Exit Full Screen' : '🔲 Full Screen'}
            </button>
          </>
        )}
        <TripMap 
          source={isEditing ? source : trip.source} 
          destination={isEditing ? destination : trip.destination} 
          checkpoints={isEditing ? checkpoints.filter(c => c.lat) : trip.checkpoints}
          liveLocations={isInProgress ? liveLocations : []}
          enableNavigation={isInProgress}
          isNavigating={isNavigating}
          isFullscreen={isFullscreen}
        />
      </div>
    </div>
  );
}
