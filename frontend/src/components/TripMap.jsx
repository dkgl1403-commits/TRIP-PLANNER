import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to generate consistent colors for participants based on ID or Name
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    // Keep it vivid but not pure white/black
    let adjusted = Math.max(50, Math.min(220, value));
    color += ('00' + adjusted.toString(16)).substr(-2);
  }
  return color;
};

// Generate CSS Arrow icon for Participants
const getParticipantIcon = (color) => {
  return L.divIcon({
    className: 'participant-marker',
    html: `<div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 24px solid ${color}; filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.4));"></div>`,
    iconSize: [20, 24],
    iconAnchor: [10, 12]
  });
};

function RoutingMachine({ source, destination, checkpoints, enableNavigation, liveLocation, onRoutesFound }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const waypoints = [];
    const effectiveSource = (enableNavigation && liveLocation) ? liveLocation : source;
    if (effectiveSource && effectiveSource.lat && effectiveSource.lon) {
      waypoints.push(L.latLng(effectiveSource.lat, effectiveSource.lon));
    }
    
    if (checkpoints && checkpoints.length > 0) {
      checkpoints.forEach(cp => {
        if (cp.lat && cp.lon) {
          waypoints.push(L.latLng(cp.lat, cp.lon));
        }
      });
    }

    if (destination && destination.lat && destination.lon) {
      waypoints.push(L.latLng(destination.lat, destination.lon));
    }

    if (waypoints.length > 0) {
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints(waypoints);
      } else {
        const control = L.Routing.control({
          waypoints: waypoints,
          lineOptions: {
            styles: [{ color: '#1e3a8a', opacity: 0.8, weight: 6 }]
          },
          altLineOptions: {
            styles: [{ color: '#6b7280', opacity: 0.5, weight: 4, dashArray: '10,10' }]
          },
          show: false,
          routeWhileDragging: false,
          addWaypoints: false,
          fitSelectedRoutes: true,
          showAlternatives: true
        }).addTo(map);

        control.on('routesfound', (e) => {
          if (onRoutesFound) {
            const routeData = e.routes.map((route, idx) => {
              const segments = [];
              let currentDist = 0;
              let currentTime = 0;
              if (route.instructions) {
                 route.instructions.forEach(inst => {
                    currentDist += inst.distance || 0;
                    currentTime += inst.time || 0;
                    // LRM uses 'WaypointReached' and 'DestinationReached'
                    if (inst.type === 'WaypointReached' || inst.type === 'DestinationReached') {
                       segments.push({
                         distanceKm: (currentDist / 1000).toFixed(1),
                         timeHrs: Math.floor(currentTime / 3600),
                         timeMins: Math.floor((currentTime % 3600) / 60)
                       });
                       currentDist = 0;
                       currentTime = 0;
                    }
                 });
                 if (currentDist > 10) {
                   segments.push({
                     distanceKm: (currentDist / 1000).toFixed(1),
                     timeHrs: Math.floor(currentTime / 3600),
                     timeMins: Math.floor((currentTime % 3600) / 60)
                   });
                 }
              }

              return {
                name: idx === 0 ? 'Recommended Route' : `Alternative ${idx}`,
                distanceKm: (route.summary.totalDistance / 1000).toFixed(1),
                timeHrs: Math.floor(route.summary.totalTime / 3600),
                timeMins: Math.floor((route.summary.totalTime % 3600) / 60),
                segments: segments
              };
            });
            onRoutesFound(routeData);
          }
        });

        routingControlRef.current = control;
      }
    } else {
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
      }
      if (onRoutesFound) onRoutesFound([]);
    }

  }, [map, source, destination, checkpoints, enableNavigation, liveLocation]);

  return null;
}

function NavigationController({ isNavigating, onLocationUpdate }) {
  const map = useMap();
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const prevLatLng = useRef(null);
  const targetLatLng = useRef(null);
  const currentLatLng = useRef(null);
  const currentHeading = useRef(0);
  const targetHeading = useRef(0);
  const animFrameRef = useRef(null);
  const hasZoomed = useRef(false);
  const errorShown = useRef(false);
  const isMovingRef = useRef(false);

  // Smooth interpolation loop at 60fps
  const animate = React.useCallback(() => {
    if (!currentLatLng.current || !targetLatLng.current) {
      animFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    // Only interpolate when actually moving
    if (isMovingRef.current) {
      const lerp = (a, b, t) => a + (b - a) * t;
      const speed = 0.08;

      currentLatLng.current = [
        lerp(currentLatLng.current[0], targetLatLng.current[0], speed),
        lerp(currentLatLng.current[1], targetLatLng.current[1], speed)
      ];

      // Smoothly interpolate heading (handle 360° wraparound)
      let headingDiff = targetHeading.current - currentHeading.current;
      if (headingDiff > 180) headingDiff -= 360;
      if (headingDiff < -180) headingDiff += 360;
      currentHeading.current += headingDiff * speed;

      const pos = currentLatLng.current;

      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      }

      if (circleRef.current) {
        circleRef.current.setLatLng(pos);
      }

      // Smooth camera follow — only when moving
      map.panTo(pos, { animate: false });
    }

    // Always update arrow rotation (even when settling)
    if (markerRef.current) {
      const el = markerRef.current.getElement();
      if (el) {
        const arrow = el.querySelector('.nav-arrow');
        if (arrow) arrow.style.transform = `rotate(${currentHeading.current}deg)`;
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [map]);

  useEffect(() => {
    let watchId;
    if (isNavigating && "geolocation" in navigator) {
      hasZoomed.current = false;
      errorShown.current = false;

      // Create marker with a styled arrow + pulse ring
      const iconHtml = `
        <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(59,130,246,0.2);animation:navPulse 2s ease-in-out infinite;"></div>
          <div style="position:absolute;width:20px;height:20px;border-radius:50%;background:rgba(59,130,246,0.35);"></div>
          <div class="nav-arrow" style="position:absolute;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:28px solid #3b82f6;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));transform-origin:50% 60%;transition:transform 0.1s linear;top:-4px;"></div>
        </div>`;
      const icon = L.divIcon({
        className: 'nav-marker-smooth',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Inject the pulse animation CSS
      if (!document.getElementById('nav-pulse-css')) {
        const style = document.createElement('style');
        style.id = 'nav-pulse-css';
        style.textContent = `
          @keyframes navPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.8); opacity: 0; }
          }
          .nav-marker-smooth { background: none !important; border: none !important; }
        `;
        document.head.appendChild(style);
      }

      const marker = L.marker([0, 0], { icon, zIndexOffset: 1000 }).addTo(map);
      markerRef.current = marker;

      const circle = L.circle([0, 0], { radius: 30, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }).addTo(map);
      circleRef.current = circle;

      // Start the smooth animation loop
      animFrameRef.current = requestAnimationFrame(animate);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading, accuracy } = position.coords;
          const latlng = [latitude, longitude];

          // Update the accuracy circle radius
          if (circleRef.current) {
            circleRef.current.setRadius(Math.max(accuracy || 30, 15));
          }

          // Dead zone: ignore GPS jitter when stationary (< 5 meters movement)
          const getDistMeters = (a, b) => {
            const R = 6371000;
            const dLat = (b[0] - a[0]) * Math.PI / 180;
            const dLon = (b[1] - a[1]) * Math.PI / 180;
            const x = Math.sin(dLat/2) ** 2 + Math.cos(a[0] * Math.PI/180) * Math.cos(b[0] * Math.PI/180) * Math.sin(dLon/2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
          };

          const isFirstFix = !currentLatLng.current;
          const movedEnough = isFirstFix || getDistMeters(prevLatLng.current || latlng, latlng) > 5;

          if (movedEnough) {
            // Calculate heading from movement if device doesn't provide it
            let newHeading = heading;
            if (newHeading === null || isNaN(newHeading)) {
              if (prevLatLng.current) {
                const dy = latlng[0] - prevLatLng.current[0];
                const dx = Math.cos(Math.PI / 180 * prevLatLng.current[0]) * (latlng[1] - prevLatLng.current[1]);
                newHeading = Math.atan2(dx, dy) * 180 / Math.PI;
              } else {
                newHeading = 0;
              }
            }
            prevLatLng.current = latlng;

            // Set the target for the interpolation loop
            targetLatLng.current = latlng;
            targetHeading.current = newHeading;
            isMovingRef.current = true;

            // On first fix, snap immediately
            if (isFirstFix) {
              currentLatLng.current = [...latlng];
              currentHeading.current = newHeading;
            }

            // Zoom in on first GPS fix
            if (!hasZoomed.current) {
              map.setView(latlng, 18, { animate: true, duration: 1.5 });
              hasZoomed.current = true;
            }

            // Update parent component to recalculate dynamic routing!
            if (onLocationUpdate) {
              onLocationUpdate({ lat: latlng[0], lon: latlng[1] });
            }
          } else {
            // Stationary — stop interpolation drift
            isMovingRef.current = false;
          }
        },
        (error) => {
          console.error("Navigation geolocation error:", error);
          if (!errorShown.current) {
            errorShown.current = true;
            alert("Location access denied or unavailable. " + error.message);
          }
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      // Cleanup
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      if (circleRef.current) {
        map.removeLayer(circleRef.current);
        circleRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      prevLatLng.current = null;
      targetLatLng.current = null;
      currentLatLng.current = null;
      hasZoomed.current = false;
    }

    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isNavigating, map, animate]);

  return null;
}

function ResizeController({ isFullscreen }) {
  const map = useMap();
  useEffect(() => {
    // Wait a short tick for CSS transitions/render before invalidating size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [isFullscreen, map]);
  return null;
}

export default function TripMap({ source, destination, checkpoints = [], liveLocations = [], enableNavigation = false, isNavigating = false, isFullscreen = false, hoveredLocation = null, onRoutesFound }) {
  const [routes, setRoutes] = React.useState([]);
  const [liveLocation, setLiveLocation] = React.useState(null);

  // Find the coordinates of the hovered location
  const getHoveredCoords = () => {
    if (!hoveredLocation) return null;
    if (source && source.name === hoveredLocation && source.lat) return { lat: source.lat, lon: source.lon, name: source.name };
    if (destination && destination.name === hoveredLocation && destination.lat) return { lat: destination.lat, lon: destination.lon, name: destination.name };
    const cp = checkpoints.find(c => c.name === hoveredLocation);
    if (cp && cp.lat) return { lat: cp.lat, lon: cp.lon, name: cp.name };
    return null;
  };
  const hoveredData = getHoveredCoords();

  const handleRoutesFound = React.useCallback((routeData) => {
    setRoutes(routeData);
    if (onRoutesFound) onRoutesFound(routeData);
  }, [onRoutesFound]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
    <MapContainer 
      center={[20.5937, 78.9629]} // Default to India
      zoom={5} 
      style={{ height: '100%', width: '100%', borderRadius: '15px' }}
    >
      <style>{`
        .leaflet-routing-container {
          display: ${isNavigating ? 'block' : 'none'} !important;
          max-height: 300px;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          margin-top: 10px !important;
          margin-right: 10px !important;
        }
        .leaflet-routing-alt h2 { display: none; }
        @keyframes pulseMarker {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
        }
      `}</style>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RoutingMachine 
        source={source} 
        destination={destination} 
        checkpoints={checkpoints} 
        enableNavigation={enableNavigation}
        liveLocation={liveLocation}
        onRoutesFound={handleRoutesFound}
      />
      <NavigationController 
        isNavigating={isNavigating} 
        onLocationUpdate={setLiveLocation} 
      />

      {/* Trigger map resize on fullscreen toggle */}
      <ResizeController isFullscreen={isFullscreen} />

      {/* Render live participant locations as colored arrows */}
      {liveLocations.map((loc, idx) => {
        const participantColor = stringToColor(loc.login_id || loc.name);
        return (
          <Marker key={idx} position={[loc.lat, loc.lon]} icon={getParticipantIcon(participantColor)}>
            <Popup>
              <strong>{loc.name}</strong><br/>
              Updated: {new Date(loc.last_updated).toLocaleTimeString()}
            </Popup>
          </Marker>
        );
      })}

      {/* Render tooltip for hovered location */}
      {hoveredData && (
        <Marker 
          position={[hoveredData.lat, hoveredData.lon]} 
          zIndexOffset={2000}
          icon={L.divIcon({
            className: 'hovered-marker',
            html: `<div style="width: 24px; height: 24px; background: #fbbf24; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); animation: pulseMarker 2s infinite;"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })}
        >
          <Popup autoPan={false}>{hoveredData.name}</Popup>
        </Marker>
      )}
    </MapContainer>

    {/* Distance & Time Overlay */}
    {routes.length > 0 && (
      <div style={{
        position: 'absolute', bottom: '15px', left: '15px', zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)',
        borderRadius: '14px', padding: '14px 18px',
        color: 'white', fontSize: '0.85rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        maxWidth: '280px', pointerEvents: 'none'
      }}>
        {routes.map((r, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: idx > 0 ? '8px 0 0 0' : '0',
            borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none',
            marginTop: idx > 0 ? '8px' : '0',
            opacity: idx === 0 ? 1 : 0.6
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
              background: idx === 0 ? '#3b82f6' : '#6b7280'
            }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: idx === 0 ? 700 : 400, fontSize: idx === 0 ? '0.95rem' : '0.8rem' }}>
                {r.distanceKm} km
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                {r.name} • {r.timeHrs > 0 ? `${r.timeHrs}h ` : ''}{r.timeMins}m
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
  );
}
