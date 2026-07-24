import React, { useState, useEffect, useCallback, useRef } from 'react';
import './CreateTrip.css'; // Re-use the styling from Create Trip for consistency
import './TripDetails.css'; // Split Layout styles
import TripMap from './TripMap';
import GlobalExpenseDashboard from './GlobalExpenseDashboard';

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
  const [routeData, setRouteData] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

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
  const [activeTab, setActiveTabRaw] = useState('dashboard');
  
  const setActiveTab = useCallback((tab) => {
    setActiveTabRaw(tab);
    window.history.pushState({ view: 'view_trip', tripId, tab }, '', '');
  }, [tripId]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.view === 'view_trip') {
        setActiveTabRaw(e.state.tab || 'dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationData, setLocationData] = useState({ name: '', description: '', lat: null, lon: null, city: '', state: '' });
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [savedLocations, setSavedLocations] = useState([]);

  // Fetch saved locations on mount
  useEffect(() => {
    if (user?.login_id) {
      fetch(`/api/locations?login_id=${user.login_id}`)
        .then(r => r.json())
        .then(data => { if (data.locations) setSavedLocations(data.locations); })
        .catch(console.error);
    }
  }, [user]);

  const handleSaveLocationClick = async () => {
    setIsSavingLocation(true);
    
    const fetchCityState = async (lat, lon) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || '';
        const state = data.address?.state || '';
        return { city, state };
      } catch (err) {
        console.error("Reverse geocoding failed", err);
        return { city: '', state: '' };
      }
    };

    const openModalWithCoords = async (lat, lon) => {
      const { city, state } = await fetchCityState(lat, lon);
      setLocationData({ name: '', description: '', lat, lon, city, state });
      setShowLocationModal(true);
      setIsSavingLocation(false);
    };

    const fallbackToIpGeolocation = async () => {
      try {
        console.log("Trying IP-based geolocation...");
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.latitude && data.longitude) {
          await openModalWithCoords(data.latitude, data.longitude);
          return;
        }
      } catch (e) { console.error("ipapi.co failed", e); }
      
      try {
        console.log("Trying ip-api.com fallback...");
        const res = await fetch('http://ip-api.com/json/?fields=lat,lon,city,regionName');
        const data = await res.json();
        if (data.lat && data.lon) {
          setLocationData({ name: '', description: '', lat: data.lat, lon: data.lon, city: data.city || '', state: data.regionName || '' });
          setShowLocationModal(true);
          setIsSavingLocation(false);
          return;
        }
      } catch (e) { console.error("ip-api.com failed", e); }
      
      // Absolute last resort: open modal with empty fields
      setLocationData({ name: '', description: '', lat: 0, lon: 0, city: '', state: '' });
      setShowLocationModal(true);
      setIsSavingLocation(false);
    };

    // METHOD 1: Use already-tracked live location (from trip tracking)
    if (myLocation && myLocation.lat && myLocation.lon) {
      console.log("Using tracked myLocation:", myLocation);
      await openModalWithCoords(myLocation.lat, myLocation.lon);
      return;
    }

    // METHOD 2: Try browser Geolocation API (works on HTTPS / localhost)
    if (navigator.geolocation) {
      let resolved = false;
      
      const geoTimeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log("Browser geolocation timed out, falling back to IP...");
          fallbackToIpGeolocation();
        }
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(geoTimeout);
          console.log("Browser geolocation succeeded:", pos.coords);
          await openModalWithCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(geoTimeout);
          console.warn("Browser geolocation failed:", err.message, "- falling back to IP...");
          fallbackToIpGeolocation();
        },
        { timeout: 4000, enableHighAccuracy: false, maximumAge: 60000 }
      );
      return;
    }

    // METHOD 3: No geolocation API at all, use IP directly
    console.log("No geolocation API, using IP fallback...");
    await fallbackToIpGeolocation();
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!locationData.name) return alert("Please enter a name for the location");
    
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_id: user.login_id,
          name: locationData.name,
          description: locationData.description,
          lat: locationData.lat,
          lon: locationData.lon,
          city: locationData.city,
          state: locationData.state
        })
      });
      if (!res.ok) throw new Error("Failed to save location");
      
      const newLoc = await res.json();
      setSavedLocations([{...locationData, id: newLoc.id}, ...savedLocations]);
      setShowLocationModal(false);
      alert("Location saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };


  const [mediaList, setMediaList] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const fetchTripMedia = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/media`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'media' && tripId) {
      fetchTripMedia();
    }
  }, [activeTab, tripId]);

  
  const handleDownloadSelected = async () => {
    if (selectedMediaIds.length === 0) return;
    
    // We fetch each selected media as a blob and force download
    // to prevent the browser from just opening them in new tabs.
    const selectedItems = mediaList.filter(m => selectedMediaIds.includes(m.id));
    
    for (const item of selectedItems) {
      try {
        const response = await fetch(item.file_url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        
        // Extract filename or generate one
        let filename = 'download';
        if (item.file_type.startsWith('image/')) filename = `trip_photo_${item.id}.jpg`;
        if (item.file_type.startsWith('video/')) filename = `trip_video_${item.id}.mp4`;
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
        
        // Small delay to prevent browser crash/blocking
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error("Failed to download item", item.id, err);
      }
    }
    
    setIsSelectMode(false);
    setSelectedMediaIds([]);
  };

  const toggleMediaSelection = (id) => {
    setSelectedMediaIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Get pre-signed URL from our backend
        const urlRes = await fetch(`/api/trips/${tripId}/media/upload_url?file_name=${encodeURIComponent(file.name)}&file_type=${encodeURIComponent(file.type)}`);
        const urlData = await urlRes.json();
        
        if (!urlRes.ok) throw new Error(urlData.detail || "Failed to get upload URL");
        
        // 2. Upload file directly to Oracle Object Storage
        const uploadRes = await fetch(urlData.upload_url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });
        
        if (!uploadRes.ok) throw new Error("Failed to upload to Oracle");
        
        // 3. Save metadata to backend
        const saveRes = await fetch(`/api/trips/${tripId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login_id: user?.login_id || '',
            file_url: urlData.file_url,
            file_type: file.type
          })
        });
        
        if (!saveRes.ok) throw new Error("Failed to save media metadata");
      }
      
      // Refresh media list
      fetchTripMedia();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file: " + error.message);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantMobile, setNewParticipantMobile] = useState('');
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [personQuery, setPersonQuery] = useState('');
  const [personResults, setPersonResults] = useState([]);
  const personSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (personSearchRef.current && !personSearchRef.current.contains(event.target)) {
        setPersonResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
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

  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [editingParticipants, setEditingParticipants] = useState({});
  const [participantToRemove, setParticipantToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

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
      const res = await fetch(`/api/trips/${tripId}/live?t=${Date.now()}`);
      const data = await res.json();
      if (res.ok) {
        setLiveLocations(data.locations || []);
      }
    } catch (err) {
      console.error("Error fetching live locations:", err);
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

  // Deduplicate participants to fix double display
  const dedupedParticipants = trip && trip.participants ? trip.participants.filter((p, index, self) =>
    index === self.findIndex((t) => (
      (t.login_id && t.login_id === p.login_id) || (t.name === p.name)
    ))
  ) : [];

  const sortedParticipants = [...dedupedParticipants].sort((a, b) => {
    if (!isInProgress || !trip.destination) return 0;
    
    const liveLocA = liveLocations.find(l => l.name === a.name || l.login_id === a.login_id);
    const liveLocB = liveLocations.find(l => l.name === b.name || l.login_id === b.login_id);
    
    const pMobileStrA = String(a.mobile || '').replace(/\D/g, '').slice(-10);
    const userMobileStr = String(user?.phone || '').replace(/\D/g, '').slice(-10);
    const isAMe = a.login_id === user?.login_id || (pMobileStrA && userMobileStr && pMobileStrA === userMobileStr);
                  
    const pMobileStrB = String(b.mobile || '').replace(/\D/g, '').slice(-10);
    const isBMe = b.login_id === user?.login_id || (pMobileStrB && userMobileStr && pMobileStrB === userMobileStr);
    
    const getFallbackLoc = (pName) => {
      const userCheckins = trip.checkins?.[pName] || [];
      if (userCheckins.length === 0) return null;
      const maxIdx = Math.max(...userCheckins.map(c => c.order_idx));
      const cp = trip.checkpoints?.find(c => c.order_idx === maxIdx);
      if (cp) return { lat: cp.lat, lon: cp.lon };
      return null;
    };
    
    const actualLocA = isAMe ? myLocation : (liveLocA ? {lat: liveLocA.lat, lon: liveLocA.lon} : null);
    const hasLiveA = !!actualLocA;
    const locA = hasLiveA ? actualLocA : getFallbackLoc(a.name);
    
    const actualLocB = isBMe ? myLocation : (liveLocB ? {lat: liveLocB.lat, lon: liveLocB.lon} : null);
    const hasLiveB = !!actualLocB;
    const locB = hasLiveB ? actualLocB : getFallbackLoc(b.name);
    
    const distA = locA ? getDistanceKm(locA.lat, locA.lon, trip.destination.lat, trip.destination.lon) : Infinity;
    const distB = locB ? getDistanceKm(locB.lat, locB.lon, trip.destination.lat, trip.destination.lon) : Infinity;
    
    // Group 1 (Live GPS) always above Group 2 (TBC)
    if (hasLiveA && !hasLiveB) return -1;
    if (!hasLiveA && hasLiveB) return 1;
    
    // Sort within their respective groups by distance
    if (distA !== distB) {
        if (distA === Infinity) return 1;
        if (distB === Infinity) return -1;
        return distA - distB;
    }
    
    // Tie-breaker: sort alphabetically
    return (a.name || '').localeCompare(b.name || '');
  });



  const handleStartNavigation = () => {
    setIsNavigating(true);
    setIsFullscreen(true);
  };
  
  const handleExitNavigation = () => {
    setIsNavigating(false);
    setIsFullscreen(false);
  };

  const handleRemoveParticipantClick = (participantName) => {
    setParticipantToRemove(participantName);
  };

  const confirmRemoveParticipant = async () => {
    if (!participantToRemove) return;
    setIsRemoving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/participants/${encodeURIComponent(participantToRemove)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setTrip(prev => ({
          ...prev,
          participants: (prev.participants || []).filter(p => p.name !== participantToRemove)
        }));
        setSuccessMsg("Participant removed successfully!");
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.detail || "Failed to remove participant");
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg("Network error while removing participant");
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setIsRemoving(false);
      setParticipantToRemove(null);
    }
  };

  const handleEditParticipant = async (originalName, pState) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/participants`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_name: originalName,
          name: pState.name,
          mobile: pState.mobile,
          email: pState.email
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTrip(prev => ({
          ...prev,
          participants: prev.participants.map(p => 
            p.name === originalName ? { ...p, name: pState.name, mobile: pState.mobile, email: pState.email } : p
          )
        }));
        setEditingParticipants(prev => {
          const next = {...prev};
          delete next[pState.name];
          if (pState.name !== originalName) delete next[originalName];
          return next;
        });
        setSuccessMsg("Participant updated successfully!");
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.detail || "Failed to update participant");
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg("Network error while updating participant");
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleAddParticipant = async () => {
    if (!newParticipantName.trim()) {
      setErrorMsg("Please enter a name for the participant.");
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    try {
      setIsAddingParticipant(true);
      const res = await fetch(`/api/trips/${tripId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newParticipantName,
          mobile: newParticipantMobile,
          email: newParticipantEmail
        })
      });
      const data = await res.json();
      if (res.ok) {
        // Update local state immediately
        setTrip(prev => ({
          ...prev,
          participants: [...(prev.participants || []), {
            name: newParticipantName,
            mobile: newParticipantMobile,
            email: newParticipantEmail
          }]
        }));
        setNewParticipantName('');
        setNewParticipantMobile('');
        setNewParticipantEmail('');
        setSuccessMsg("Participant added successfully!");
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.detail || "Failed to add participant");
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg("Network error while adding participant");
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setIsAddingParticipant(false);
    }
  };

  const handleCheckpointClick = (locationName) => {
    if (!locationName) return;
    setHoveredLocation(prev => prev === locationName ? null : locationName);
  };


  return (
    <div className="trip-details-layout">
      {/* ---------------- DASHBOARD MODE (Split Screen) ---------------- */}
      {activeTab === 'dashboard' && (
        <>
          {/* LEFT PANEL: PARTICIPANTS */}
          <div className="trip-left-panel glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>👥 Participants ({sortedParticipants.length})</h3>
              {isInProgress && (
                <button onClick={fetchLiveLocations} className="trip-detail-btn" style={{ padding: '5px 10px', fontSize: '0.75rem', borderRadius: '10px' }}>
                  🔄 Refresh
                </button>
              )}
            </div>
            
            <div className="participants-scroll">
              {sortedParticipants.map((p, idx) => {
                const color = participantColors[idx % participantColors.length];
                const pMobileStr = String(p.mobile || '').replace(/\D/g, '').slice(-10);
                const userMobileStr = String(user?.phone || '').replace(/\D/g, '').slice(-10);
                const isMe = p.login_id === user?.login_id || (pMobileStr && userMobileStr && pMobileStr === userMobileStr);
                const liveLoc = liveLocations.find(l => l.name === p.name || (l.login_id && p.login_id && l.login_id === p.login_id));
                let distanceText = '';
                
                const userCheckins = trip.checkins?.[p.name] || [];
                const nextCp = trip.checkpoints?.find(cp => !userCheckins.some(c => c.order_idx === cp.order_idx)) || trip.destination;
                
                if (isInProgress) {
                  if (liveLoc && nextCp) {
                    const dist = getDistanceKm(liveLoc.lat, liveLoc.lon, nextCp.lat, nextCp.lon);
                    distanceText = dist < 1 ? `${(dist * 1000).toFixed(0)}m to next CP` : `${dist.toFixed(1)}km to next CP`;
                  } else if (isMe && myLocation && nextCp) {
                    const dist = getDistanceKm(myLocation.lat, myLocation.lon, nextCp.lat, nextCp.lon);
                    distanceText = dist < 1 ? `${(dist * 1000).toFixed(0)}m to next CP` : `${dist.toFixed(1)}km to next CP`;
                  } else {
                    distanceText = 'Location TBC';
                  }
                }
                let oweText = null;
                let receiveText = null;
                if (!isMe && trip.settlements && user?.name) {
                  const toPay = trip.settlements.find(s => s.from === user.name && s.to === p.name);
                  const toReceive = trip.settlements.find(s => s.from === p.name && s.to === user.name);
                  if (toPay) oweText = `Pay ₹${toPay.amount.toFixed(0)}`;
                  if (toReceive) receiveText = `Receive ₹${toReceive.amount.toFixed(0)}`;
                }
                
                let userDistText = '';
                if (isInProgress && !isMe && myLocation && liveLoc) {
                  const distFromMe = getDistanceKm(myLocation.lat, myLocation.lon, liveLoc.lat, liveLoc.lon);
                  userDistText = distFromMe < 1 ? `${(distFromMe * 1000).toFixed(0)}m away` : `${distFromMe.toFixed(1)}km away`;
                }

                return (
                  <div key={idx} className={`participant-sleek-card ${isMe ? 'is-me' : ''}`} style={{ borderLeft: `4px solid ${color}` }}>
                    <div className="p-card-header">
                      <div className="p-avatar" style={{ background: color }}>{p.name ? p.name.charAt(0).toUpperCase() : '?'}</div>
                      <div className="p-info">
                        <div className="p-name">
                          {p.name} {isMe && <span className="p-badge">You</span>}
                        </div>
                        {distanceText && <div className="p-dist">📍 {distanceText}</div>}
                        {userDistText && <div className="p-dist" style={{marginTop: '2px', color: '#9ca3af'}}>🚗 {userDistText} from you</div>}
                      </div>
                      <div className="p-expenses">
                        {receiveText && <span className="text-green" style={{fontWeight: 'bold'}}>↑ {receiveText}</span>}
                        {oweText && <span className="text-red" style={{fontWeight: 'bold'}}>↓ {oweText}</span>}
                      </div>
                    </div>
                    
                    {(isInProgress || isCompleted) && (() => {
                      let progressPercent = 0;
                      if (isCompleted) {
                        progressPercent = 100;
                      } else if (isInProgress) {
                        const nodes = [trip.source, ...(trip.checkpoints || []), trip.destination].filter(Boolean);
                        let nextIdx = 1;
                        while (nextIdx < nodes.length) {
                          if (!userCheckins.some(c => c.order_idx === nodes[nextIdx].order_idx)) break;
                          nextIdx++;
                        }
                        const nodeCount = nodes.length;
                        if (nextIdx >= nodes.length) {
                           progressPercent = (nodeCount - 1 + 0.5) * (100 / nodeCount); // Center of last node
                        } else {
                           const segmentStart = nodes[nextIdx - 1];
                           const segmentEnd = nodes[nextIdx];
                           const userLocToUse = isMe ? myLocation : liveLoc;
                           if (userLocToUse && segmentStart && segmentEnd) {
                             const distStartToEnd = getDistanceKm(segmentStart.lat, segmentStart.lon, segmentEnd.lat, segmentEnd.lon);
                             const distUserToEnd = getDistanceKm(userLocToUse.lat, userLocToUse.lon, segmentEnd.lat, segmentEnd.lon);
                             const distUserToStart = getDistanceKm(userLocToUse.lat, userLocToUse.lon, segmentStart.lat, segmentStart.lon);
                             
                             let segmentProgress = 0;
                             if (distStartToEnd > 0) {
                               segmentProgress = distUserToStart / (distUserToStart + distUserToEnd);
                             }
                             if (segmentProgress > 1) segmentProgress = 1;
                             
                             const left1 = (nextIdx - 1 + 0.5) * (100 / nodeCount);
                             const left2 = (nextIdx + 0.5) * (100 / nodeCount);
                             progressPercent = left1 + segmentProgress * (left2 - left1);
                           } else {
                             progressPercent = (nextIdx - 1 + 0.5) * (100 / nodeCount);
                           }
                        }
                      }
                      
                      return (
                      <div className="p-card-progress">
                        <div className="p-progress-line"></div>
                        <div style={{
                          position: 'absolute',
                          top: '9px',
                          left: `${progressPercent}%`,
                          transform: 'translateX(-50%)',
                          width: '16px',
                          height: '16px',
                          background: color,
                          borderRadius: '50%',
                          border: '2px solid white',
                          zIndex: 2,
                          boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                          transition: 'left 1s ease-out'
                        }}></div>
                        <div className="p-checkpoint" onClick={() => handleCheckpointClick(trip.source?.name)} style={{cursor: 'pointer'}}>
                          <div className="p-dot active"></div>
                          <span>Start</span>
                        </div>
                        {trip.checkpoints?.map((cp) => {
                          const checkedIn = userCheckins.some(c => c.order_idx === cp.order_idx);
                          let canCheckIn = false;
                          if (isMe && isInProgress && myLocation && !checkedIn) {
                            const distToCp = getDistanceKm(myLocation.lat, myLocation.lon, cp.lat, cp.lon);
                            if (distToCp < 5.0) { // < 5 km
                              canCheckIn = true;
                            }
                          }
                          return (
                            <div key={cp.order_idx} className="p-checkpoint" onClick={() => handleCheckpointClick(cp.name)} style={{cursor: 'pointer'}}>
                              <div className={`p-dot ${checkedIn ? 'active' : ''}`}></div>
                              <span>CP {cp.order_idx}</span>
                              {canCheckIn && (
                                <button className="checkin-btn-small" onClick={() => handleCheckin(p.name, cp.order_idx)}>Check In</button>
                              )}
                            </div>
                          );
                        })}
                        {trip.destination && (
                          <div className="p-checkpoint" onClick={() => handleCheckpointClick(trip.destination?.name)} style={{cursor: 'pointer'}}>
                            <div className={`p-dot ${isCompleted ? 'active' : ''}`}></div>
                            <span>End</span>
                          </div>
                        )}
                      </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: OPTIONS MENU */}
          <div className="trip-right-panel glass-panel" style={{position: 'relative', display: 'flex', flexDirection: 'column'}}>
            <div className="trip-header">
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="round-icon-btn" title="Back to Dashboard" onClick={onBack}>⬅</button>
                <h2 className="trip-title" title={trip.title}>{trip.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!isEditing && isOwner && isPlanned && (
                  <>
                    <button className="round-icon-btn" title="Start Trip" onClick={handleStartTrip} style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                      <svg viewBox="0 0 100 100" width="100%" height="100%" className="animate-[spin_8s_linear_infinite]">
                        <path id="curveStart" fill="transparent" d="M 12,50 A 38,38 0 1,1 88,50 A 38,38 0 1,1 12,50" />
                        <text fontSize="18" fontWeight="bold" fill="#34d399" letterSpacing="3">
                          <textPath href="#curveStart" startOffset="0">START TRIP • START TRIP • </textPath>
                        </text>
                      </svg>
                    </button>
                    <button className="round-icon-btn danger" title="Cancel Trip" onClick={handleCancelTrip} style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 100 100" width="100%" height="100%" className="animate-[spin_8s_linear_infinite]">
                        <path id="curveCancel" fill="transparent" d="M 12,50 A 38,38 0 1,1 88,50 A 38,38 0 1,1 12,50" />
                        <text fontSize="16" fontWeight="bold" fill="white" letterSpacing="3">
                          <textPath href="#curveCancel" startOffset="0">CANCEL TRIP • CANCEL TRIP • </textPath>
                        </text>
                      </svg>
                    </button>
                  </>
                )}
                {!isEditing && isOwner && isInProgress && (
                  <button className="round-icon-btn danger" title="End Trip" onClick={handleEndTrip} style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%" className="animate-[spin_8s_linear_infinite]">
                      <path id="curveEnd" fill="transparent" d="M 12,50 A 38,38 0 1,1 88,50 A 38,38 0 1,1 12,50" />
                      <text fontSize="18" fontWeight="bold" fill="white" letterSpacing="4">
                        <textPath href="#curveEnd" startOffset="0">END TRIP • END TRIP • </textPath>
                      </text>
                    </svg>
                  </button>
                )}
                <div className={`status-badge ${trip.status === 'In Progress' ? 'status-green' : 'status-blue'}`}>{trip.status || 'Planned'}</div>
              </div>
            </div>

            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <h3 className="options-heading" style={{ marginTop: '10px', marginBottom: '20px', fontSize: '1.2rem', textAlign: 'center' }}>What would you like to do?</h3>
            <div className="trip-options-grid">
              <div className="trip-option-card" onClick={() => setActiveTab('detail')}>
                <div className="opt-icon" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <span className="material-symbols-outlined" style={{color: '#a1a1aa'}}>map</span>
                </div>
                <h4>Trip Detail</h4>
                <p>View route, map, and itinerary notes.</p>
              </div>
              <div className="trip-option-card" onClick={handleStartNavigation}>
                <div className="opt-icon" style={{background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                  <span className="material-symbols-outlined" style={{color: '#34d399'}}>navigation</span>
                </div>
                <h4>Start Navigation</h4>
                <p>Enter full-screen live tracking mode.</p>
              </div>
              <div className="trip-option-card" onClick={() => setActiveTab('expense')}>
                <div className="opt-icon" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <span className="material-symbols-outlined" style={{color: '#a1a1aa'}}>receipt_long</span>
                </div>
                <h4>Log/View Expense</h4>
                <p>Manage and settle group expenses.</p>
              </div>
              <div className="trip-option-card" onClick={() => setActiveTab('media')}>
                <div className="opt-icon" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <span className="material-symbols-outlined" style={{color: '#a1a1aa'}}>photo_camera</span>
                </div>
                <h4>Trip Media</h4>
                <p>View and upload photos/videos.</p>
              </div>
              {isOwner && (
                <div className="trip-option-card" onClick={() => setActiveTab('participants')}>
                  <div className="opt-icon" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <span className="material-symbols-outlined" style={{color: '#a1a1aa'}}>group</span>
                  </div>
                  <h4>Manage Participants</h4>
                  <p>Add or remove people from trip.</p>
                </div>
              )}
              <div className="trip-option-card" onClick={() => setActiveTab('location')}>
                <div className="opt-icon" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <span className="material-symbols-outlined" style={{color: '#a1a1aa'}}>location_on</span>
                </div>
                <h4>Mark Location</h4>
                <p>Manual check-in and favorites.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------- FULL SCREEN TABS ---------------- */}
      {activeTab !== 'dashboard' && (
        <div className="full-screen-tab glass-panel">
          <div className="full-screen-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={() => window.history.back()} 
              className="bg-transparent border-none text-neon-coral cursor-pointer flex items-center p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="full-screen-title" style={{ margin: 0 }}>{trip.title}</h2>
            <div className={`status-badge ${trip.status === 'In Progress' ? 'status-green' : 'status-blue'}`}>{trip.status || 'Planned'}</div>
          </div>
          
          <div className="full-screen-content">
            
            {/* ---- TAB: TRIP DETAIL ---- */}
            {activeTab === 'detail' && (
              <div className="content-inner">
                {isCompleted && trip.end_lat && (
                  <div className="completed-banner">
                    <h3>✅ Trip Completed</h3>
                    <p><strong>Ended:</strong> {new Date(trip.actual_end_time).toLocaleString()}</p>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <div className="route-overview glass-panel" style={{marginBottom: '20px', padding: '20px'}}>
                      <h3 style={{margin: '0 0 15px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px'}}>🛣️ Route Overview</h3>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <div style={{display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
                          <div style={{fontSize: '1.5rem'}}>🟢</div>
                          <div>
                            <strong style={{display: 'block', fontSize: '1.1rem'}}>Start</strong>
                            <span style={{opacity: 0.8}}>{trip.source.name}</span>
                          </div>
                        </div>
                        {trip.checkpoints && trip.checkpoints.length > 0 && (
                          <div style={{display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
                            <div style={{fontSize: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'}}>
                              <div style={{width: '2px', height: '20px', background: 'rgba(255,255,255,0.2)'}}></div>
                              <span>⚪</span>
                              <div style={{width: '2px', height: '20px', background: 'rgba(255,255,255,0.2)'}}></div>
                            </div>
                            <div style={{paddingTop: '25px'}}>
                              <strong style={{display: 'block', fontSize: '1.1rem'}}>{trip.checkpoints.length} Checkpoints</strong>
                              <div style={{fontSize: '0.85rem', opacity: 0.7, display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                {trip.checkpoints.map(cp => <span key={cp.order_idx} style={{background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px'}}>{cp.name}</span>)}
                              </div>
                            </div>
                          </div>
                        )}
                        <div style={{display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
                          <div style={{fontSize: '1.5rem'}}>📍</div>
                          <div>
                            <strong style={{display: 'block', fontSize: '1.1rem'}}>Destination</strong>
                            <span style={{opacity: 0.8}}>{trip.destination.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {trip.description && (
                      <div className="trip-notes glass-panel" style={{marginBottom: '20px', padding: '20px'}}>
                        <h3 style={{margin: '0 0 10px 0'}}>📝 Itinerary & Notes</h3>
                        <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.6, opacity: 0.9, fontSize: '0.95rem'}}>{trip.description}</div>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: '2 1 500px', height: '600px', borderRadius: '15px', overflow: 'hidden' }}>
                    <TripMap
                      source={trip.source}
                      destination={trip.destination}
                      checkpoints={trip.checkpoints}
                      enableNavigation={false}
                      liveLocations={liveLocations}
                      myLocation={myLocation}
                      userLoginId={user?.login_id}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ---- TAB: NAVIGATION ---- */}
            {activeTab === 'navigation' && (
              <div className="content-inner" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h3 style={{ fontSize: '2rem' }}>🗺️ Fullscreen Navigation</h3>
                <p style={{ opacity: 0.7, marginBottom: '30px', fontSize: '1.2rem' }}>Open the map in fullscreen mode for real-time navigation and live tracking.</p>
                <button className="btn-primary" onClick={handleStartNavigation} style={{ padding: '20px 40px', fontSize: '1.3rem', borderRadius: '40px', background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                  Start Navigation
                </button>
              </div>
            )}

            {/* ---- TAB: EXPENSES ---- */}
            {activeTab === 'expense' && (
              <GlobalExpenseDashboard user={user} tripId={tripId} tripParticipants={trip.participants || []} />
            )}

            {/* ---- TAB: MEDIA ---- */}
            {activeTab === 'media' && (
              <div className="content-inner" style={{ padding: '20px', minHeight: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.8rem', margin: 0 }}>📸 Trip Gallery</h3>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*,video/*" 
                    multiple 
                    onChange={handleFileUpload} 
                  />
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {isSelectMode ? (
                      <>
                        <button 
                          onClick={() => { setIsSelectMode(false); setSelectedMediaIds([]); }}
                          style={{ padding: '10px 15px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleDownloadSelected}
                          disabled={selectedMediaIds.length === 0}
                          className="btn-primary"
                          style={{ padding: '10px 20px', borderRadius: '20px', opacity: selectedMediaIds.length === 0 ? 0.5 : 1, cursor: selectedMediaIds.length === 0 ? 'not-allowed' : 'pointer' }}
                        >
                          ⬇️ Download ({selectedMediaIds.length})
                        </button>
                      </>
                    ) : (
                      <>
                        {mediaList.length > 0 && (
                          <button 
                            onClick={() => setIsSelectMode(true)}
                            style={{ padding: '10px 15px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}
                          >
                            ✓ Select
                          </button>
                        )}
                        <button 
                          className="btn-primary" 
                          onClick={() => fileInputRef.current.click()}
                          disabled={isUploading}
                          style={{ padding: '10px 20px', borderRadius: '20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          {isUploading ? '⏳ Uploading...' : '⬆️ Upload'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {mediaList.length === 0 && !isUploading && (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏞️</div>
                    <div style={{ fontSize: '1.2rem', opacity: 0.7 }}>No media uploaded yet.</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.5, marginTop: '10px' }}>Be the first to share a memory!</div>
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                  {mediaList.map((media, idx) => (
                    <div key={idx} 
                      onClick={() => {
                        if (isSelectMode) {
                          toggleMediaSelection(media.id);
                        } else {
                          setSelectedMedia(media);
                        }
                      }}
                      style={{ 
                      aspectRatio: '1', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      background: 'rgba(0,0,0,0.2)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      transform: selectedMediaIds.includes(media.id) ? 'scale(0.95)' : 'scale(1)',
                      border: selectedMediaIds.includes(media.id) ? '3px solid #ff4b2b' : 'none'
                    }}
                    onMouseOver={(e) => { if(!isSelectMode) e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseOut={(e) => { if(!isSelectMode) e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      {isSelectMode && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: selectedMediaIds.includes(media.id) ? '#ff4b2b' : 'rgba(0,0,0,0.5)',
                          border: '2px solid white',
                          zIndex: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          {selectedMediaIds.includes(media.id) && '✓'}
                        </div>
                      )}
                      {media.file_type.startsWith('video/') ? (
                        <video src={media.file_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                      ) : (
                        <img src={media.file_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Trip Media" />
                      )}
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0, left: 0, right: 0, 
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', 
                        padding: '10px', 
                        fontSize: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>{media.uploader_name}</span>
                        <span style={{ opacity: 0.7 }}>{new Date(media.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- TAB: PARTICIPANTS ---- */}
            {activeTab === 'participants' && isOwner && (
              <div className="content-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.8rem' }}>Manage Participants</h3>
                <p style={{ opacity: 0.7, marginBottom: '30px' }}>You can view your participants here.</p>
                <div className="participants-list">
                  {(trip.participants || []).map((p, idx) => {
                    const isMe = p.login_id === user?.login_id || 
                  (p.mobile && user?.phone && String(p.mobile) === String(user.phone)) ||
                  (p.email && user?.email && String(p.email).toLowerCase() === String(user.email).toLowerCase()) ||
                  (p.name && user?.name && String(p.name).toLowerCase() === String(user.name).toLowerCase());
                    const isEditing = !!editingParticipants[p.name];
                    const editState = editingParticipants[p.name] || { name: p.name, mobile: p.mobile || '', email: p.email || '' };
                    return (
                    <div key={idx} className="participant-row" style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Name" 
                        value={isEditing ? editState.name : (p.name + (isMe ? ' (Own)' : ''))}  
                        disabled={!isEditing}
                        onChange={e => setEditingParticipants({...editingParticipants, [p.name]: {...editState, name: e.target.value}})}
                        style={{ flex: '1 1 150px', minWidth: '150px', background: isEditing ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)', border: 'none', padding: '10px', borderRadius: '8px', color: 'white' }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Mobile" 
                        value={isEditing ? editState.mobile : p.mobile} 
                        disabled={!isEditing}
                        onChange={e => setEditingParticipants({...editingParticipants, [p.name]: {...editState, mobile: e.target.value}})}
                        style={{ flex: '1 1 150px', minWidth: '150px', background: isEditing ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)', border: 'none', padding: '10px', borderRadius: '8px', color: 'white' }} 
                      />
                      <input 
                        type="email" 
                        placeholder="Email" 
                        value={isEditing ? editState.email : p.email} 
                        disabled={!isEditing}
                        onChange={e => setEditingParticipants({...editingParticipants, [p.name]: {...editState, email: e.target.value}})}
                        style={{ flex: '1 1 150px', minWidth: '150px', background: isEditing ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)', border: 'none', padding: '10px', borderRadius: '8px', color: 'white' }} 
                      />
                      {isEditing ? (
                        <div style={{display: 'flex', gap: '5px', flex: '1 1 auto', justifyContent: 'flex-end'}}>
                          <button onClick={() => handleEditParticipant(p.name, editState)} className="btn-primary" style={{padding: '5px 10px', borderRadius: '6px', fontSize: '0.85rem', background: '#10b981'}}>Save</button>
                          <button onClick={() => { const next = {...editingParticipants}; delete next[p.name]; setEditingParticipants(next); }} className="btn-primary" style={{padding: '5px 10px', borderRadius: '6px', fontSize: '0.85rem', background: '#ef4444'}}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{display: 'flex', gap: '5px', flex: '1 1 auto', justifyContent: 'flex-end'}}>
                          <button onClick={() => setEditingParticipants({...editingParticipants, [p.name]: {name: p.name, mobile: p.mobile || '', email: p.email || ''}})} className="btn-primary" style={{padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem'}}>✏️ Edit</button>
                          <button onClick={() => handleRemoveParticipantClick(p.name)} className="btn-primary" style={{padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444'}}>🗑️</button>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
                
                <div style={{ marginTop: '30px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: '0' }}>Add Registered Participant</h4>
                  </div>
                  <div style={{ position: 'relative', flex: 1 }} ref={personSearchRef}>
                    <input
                      type="text"
                      placeholder="Search registered users..."
                      value={personQuery}
                      onChange={(e) => setPersonQuery(e.target.value)}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }}
                    />
                    {personResults.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginTop: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                        {personResults.map(person => (
                          <div key={person.login_id} onClick={() => {
                            setNewParticipantName(person.name);
                            setNewParticipantMobile(person.phone || '');
                            setNewParticipantEmail('');
                            setPersonQuery(person.name);
                            setPersonResults([]);
                          }} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{person.name}</span>
                            <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{person.phone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => {
                        handleAddParticipant();
                        setPersonQuery('');
                      }} 
                      disabled={isAddingParticipant || !newParticipantName}
                      className="btn-primary" 
                      style={{ padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #34d399)' }}
                    >
                      {isAddingParticipant ? '...' : 'Add'}
                    </button>
                  </div>
                </div>
                
              </div>
            )}

            {/* ---- TAB: LOCATION ---- */}
            {activeTab === 'location' && (
              <div className="content-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>📍 Location & Check-In</h3>
                
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.4rem' }}>⭐ Favorite Locations</h4>
                  <p style={{ opacity: 0.7, fontSize: '1rem', marginBottom: '20px' }}>Save your current location as a favorite for future reference. These will be automatically suggested in future AI trip plans!</p>
                  <button 
                    onClick={handleSaveLocationClick}
                    disabled={isSavingLocation}
                    className="btn-primary" 
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', padding: '12px 25px', borderRadius: '25px', fontSize: '1rem', marginBottom: '20px' }}
                  >
                    {isSavingLocation ? 'Locating...' : 'Save Current Location'}
                  </button>
                  
                  {savedLocations.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <h5 style={{ opacity: 0.8, marginBottom: '10px' }}>Your Saved Locations</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                        {savedLocations.map(loc => (
                          <div key={loc.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '10px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{loc.name}</div>
                            {loc.description && <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '5px' }}>{loc.description}</div>}
                            <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '5px' }}>📍 {loc.city ? `${loc.city}, ` : ''}{loc.state} • {Number(loc.lat).toFixed(4)}, {Number(loc.lon).toFixed(4)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.4rem' }}>Manual Check-In</h4>
                  <p style={{ opacity: 0.7, fontSize: '1rem', marginBottom: '20px' }}>If automatic check-in fails, manually check into your next checkpoint.</p>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {trip.checkpoints?.map((cp) => (
                      <button key={cp.order_idx} onClick={() => handleCheckin(user?.name, cp.order_idx)} className="btn-primary" style={{ padding: '12px 25px', borderRadius: '25px', fontSize: '1rem' }}>
                        Check-In: {cp.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Navigation Modal */}
      {isNavigating && isFullscreen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: 'black', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '15px 20px', background: 'rgba(15, 23, 42, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <h3 style={{ margin: 0, color: 'white' }}>Navigation: {trip.title}</h3>
            <button onClick={handleExitNavigation} style={{ 
              background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', 
              borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)'
            }}>
              Exit Navigation
            </button>
          </div>
          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
            <TripMap
              source={trip.source}
              destination={trip.destination}
              checkpoints={trip.checkpoints}
              enableNavigation={true}
              isNavigating={true}
              isFullscreen={true}
              liveLocations={liveLocations}
              myLocation={myLocation}
              userLoginId={user?.login_id}
            />
          </div>
        </div>
      )}


      {/* Custom Confirmation Modal */}
      {participantToRemove && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ padding: '30px', maxWidth: '400px', width: '90%', textAlign: 'center', borderRadius: '15px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🗑️</div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.4rem' }}>Remove Participant</h3>
            <p style={{ opacity: 0.8, marginBottom: '25px', lineHeight: 1.5 }}>
              Are you sure you want to remove <strong>{participantToRemove}</strong> from this trip? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => setParticipantToRemove(null)} 
                disabled={isRemoving}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmRemoveParticipant} 
                disabled={isRemoving}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}
              >
                {isRemoving ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* --- MEDIA LIGHTBOX --- */}
      {selectedMedia && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <button 
            onClick={() => setSelectedMedia(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          
          <div style={{ maxWidth: '90%', maxHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {selectedMedia.file_type.startsWith('video/') ? (
              <video src={selectedMedia.file_url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />
            ) : (
              <img src={selectedMedia.file_url} alt="Full screen" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
            )}
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ color: 'white', textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>Uploaded by {selectedMedia.uploader_name}</div>
              <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{new Date(selectedMedia.uploaded_at).toLocaleString()}</div>
            </div>
            
            <a 
              href={selectedMedia.file_url}
              target="_blank"
              download
              className="btn-primary"
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ⬇️ Download
            </a>
          </div>
        </div>
      )}

      {/* Save Location Modal */}
      {showLocationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>📍 Save Location</h3>
            <form onSubmit={handleLocationSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', opacity: 0.7, marginBottom: '5px' }}>Location Name *</label>
                <input type="text" value={locationData.name} onChange={e => setLocationData({...locationData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }} placeholder="e.g., Hidden Waterfall Cafe" required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', opacity: 0.7, marginBottom: '5px' }}>Description (Optional)</label>
                <input type="text" value={locationData.description} onChange={e => setLocationData({...locationData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }} placeholder="Great spot for sunset" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', opacity: 0.7, marginBottom: '5px' }}>City</label>
                  <input type="text" value={locationData.city} onChange={e => setLocationData({...locationData, city: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }} placeholder="City Name" />
                </div>
                <div>
                  <label style={{ display: 'block', opacity: 0.7, marginBottom: '5px' }}>State</label>
                  <input type="text" value={locationData.state} onChange={e => setLocationData({...locationData, state: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }} placeholder="State" />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', opacity: 0.7, marginBottom: '5px', fontSize: '0.8rem' }}>Latitude</label>
                  <input type="number" step="any" value={locationData.lat} onChange={e => setLocationData({...locationData, lat: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.8rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', opacity: 0.7, marginBottom: '5px', fontSize: '0.8rem' }}>Longitude</label>
                  <input type="number" step="any" value={locationData.lon} onChange={e => setLocationData({...locationData, lon: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.8rem', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowLocationModal(false)} style={{ padding: '10px 20px', borderRadius: '25px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '25px' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
</div>
  );
}
