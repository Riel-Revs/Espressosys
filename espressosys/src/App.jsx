import React, { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import Globe from "react-globe.gl";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import espressoLogo from "./assets/esp-logo.png";
import IBMPlexMonoRegular from "./assets/fonts/IBMPlexMono-Regular.ttf";
import IBMPlexMonoBold from "./assets/fonts/IBMPlexMono-Bold.ttf";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

const EVENTS = [
  {
    id: "denver",
    name: "Denver",
    lat: 39.7392,
    lng: -104.9903,
    type: "past",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/h8/8e7df1e8-dc16-4e4e-a3e0-0c13aa7d45dc",
    link: "https://luma.com/o2446knk",
    date: "March 2024",
    country: "USA",
    attendees: 575,
  },
  {
    id: "sf",
    name: "San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    type: "past",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/39/18e29d3f-b546-46a4-833e-172e52b2d425.png",
    link: "https://luma.com/ethereum-10y-sanfrancisco",
    date: "April 2024",
    country: "USA",
    attendees: 971,
  },
  {
    id: "ny",
    name: "New York",
    lat: 40.7128,
    lng: -74.0060,
    type: "past",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/4u/2ce66858-89cd-480d-a08f-0f9b2e2c9c91.webp",
    link: "https://luma.com/yb17pn9g",
    date: "May 2024",
    country: "USA",
    attendees: 1200,
  },
  {
    id: "cannes",
    name: "Cannes",
    lat: 43.5528,
    lng: 7.0153,
    type: "past",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/p0/e248f54e-6b91-4979-ad33-2965034269d7.png",
    link: "https://luma.com/h0lmohx9",
    date: "June 2024",
    country: "France",
    attendees: 701,
  },
  {
    id: "bangkok",
    name: "Bangkok",
    lat: 13.7563,
    lng: 100.5018,
    type: "past",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/04/27f64949-5365-40f3-8665-6bb70844c81d",
    link: "https://luma.com/sequencing_day",
    date: "July 2024",
    country: "Thailand",
    attendees: 2237,
  },
  {
    id: "brussels",
    name: "Brussels",
    lat: 50.8503,
    lng: 4.3517,
    type: "past",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/fz/7a4f0d00-8988-40ce-9d08-897383981a33",
    link: "https://luma.com/ud8p6oww",
    date: "August 2024",
    country: "Belgium",
    attendees: 1101,
  },
  {
    id: "berlin",
    name: "Berlin",
    lat: 52.52,
    lng: 13.405,
    type: "past",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/lg/66aa8a08-1c4d-4a2a-8ae4-1fac476afc42.png",
    link: "https://luma.com/u407uyxp",
    date: "September 2024",
    country: "Germany",
    attendees: 13,
  },
  {
    id: "seoul",
    name: "Seoul",
    lat: 37.5665,
    lng: 126.9780,
    type: "upcoming",
    image: "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=1,background=white,quality=75,width=400,height=400/event-covers/eb/d17054bd-4286-44c4-bd7a-e0d6c0826818.png",
    link: "https://luma.com/h9uxi7c1",
    date: "September 22, 2025",
    time: "12:00 PM - 4:00 PM GMT+9",
    location: "MTL Cafe & Bakery Hannam",
    mapLink: "https://www.google.com/maps/search/?api=1&query=mtl%20cafe%20%26%20bakery%20Hannam&query_place_id=ChIJB6YiELOjfDUR3Mxw538M4aE",
  },
  {
    id: "buenos",
    name: "Buenos Aires",
    lat: -34.6118,
    lng: -58.3960,
    type: "upcoming",
    image: "data:image/jpeg;base64,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",
    link: "#",
    date: "TBA",
    time: "TBA",
  },
];

export default function EspressoWorldMap() {
  const globeRef = useRef(null);
  const [isFlat, setIsFlat] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [eventIndex, setEventIndex] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [viewport, setViewport] = useState({
    latitude: EVENTS[7].lat, // Start with first upcoming event (Seoul)
    longitude: EVENTS[7].lng,
    zoom: 1.5,
    bearing: 0,
    pitch: 0,
  });

  // Coffee cup SVGs for markers
  const pastCupSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 7H6C4.89543 7 4 7.89543 4 9V15C4 16.1046 4.89543 17 6 17H18C19.1046 17 20 16.1046 20 15V9C20 7.89543 19.1046 7 18 7Z" fill="#451F17"/><path d="M20 10H22C22.5523 10 23 10.4477 23 11V13C23 13.5523 22.5523 14 22 14H20V10Z" fill="#451F17"/><path d="M6 17H18V19H6V17Z" fill="#270903"/></svg>`;
  const upcomingCupSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 7H6C4.89543 7 4 7.89543 4 9V15C4 16.1046 4.89543 17 6 17H18C19.1046 17 20 16.1046 20 15V9C20 7.89543 19.1046 7 18 7Z" fill="#DE9E67"/><path d="M20 10H22C22.5523 10 23 10.4477 23 11V13C23 13.5523 22.5523 14 22 14H20V10Z" fill="#DE9E67"/><path d="M6 17H18V19H6V17Z" fill="#B67237"/><path d="M12 4L14 6L12 8L10 6L12 4Z" fill="#FCEBDE"/></svg>`;

  // Inject styles
  useEffect(() => {
    if (document.getElementById("espresso-map-styles")) return;
    const style = document.createElement("style");
    style.id = "espresso-map-styles";
    style.innerHTML = `
      @font-face { font-family: 'IBMPlexMono'; src: url(${IBMPlexMonoRegular}) format('truetype'); font-weight: 400; font-style: normal; }
      @font-face { font-family: 'IBMPlexMono'; src: url(${IBMPlexMonoBold}) format('truetype'); font-weight: 700; font-style: normal; }

      .map-container { position: relative; width: 100%; height: 100vh; background: linear-gradient(135deg, #FCEBDE 0%, #270903 100%); overflow: hidden; }
      canvas { width: 100% !important; height: 100% !important; }

      .espresso-marker { cursor: pointer; transform: translate(-50%, -50%); transition: transform 0.3s ease; }
      .espresso-marker:hover { transform: translate(-50%, -50%) scale(1.2); }
      .espresso-marker svg { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
      .espresso-marker .label { position: absolute; top: 36px; left: 50%; transform: translateX(-50%); color: #FCEBDE; font-size: 12px; font-weight: 700; font-family: 'IBMPlexMono', monospace; text-shadow: 0 1px 3px rgba(0,0,0,0.5); pointer-events: none; }

      .controls { position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; z-index: 100; }
      .control-btn { background: #270903; color: #FCEBDE; border: 2px solid #DE9E67; border-radius: 999px; padding: 8px 16px; font-size: 14px; font-weight: 700; font-family: 'IBMPlexMono', monospace; cursor: pointer; transition: all 0.3s ease; }
      .control-btn:hover { background: #DE9E67; color: #270903; }
      .control-btn svg { width: 20px; height: 20px; vertical-align: middle; }
      .play-btn { padding: 8px; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

      .event-overlay { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 360px; min-height: 400px; background: linear-gradient(180deg, #451F17 0%, #270903 80%); color: #FCEBDE; border-radius: 16px; padding: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 200; font-family: 'IBMPlexMono', monospace; animation: fadeIn 0.5s ease; display: flex; flex-direction: column; align-items: center; }
      .event-overlay img { width: 100%; max-width: 280px; aspect-ratio: 4/3; object-fit: cover; border-radius: 12px; margin-bottom: 8px; border: 2px solid #DE9E67; }
      .event-overlay .tag { background: #DE9E67; color: #270903; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-bottom: 8px; }
      .event-overlay h2 { font-size: 20px; font-weight: 700; margin: 0 0 8px; text-align: center; }
      .event-overlay .details { display: flex; flex-direction: column; gap: 8px; font-size: 14px; font-weight: 400; margin-bottom: 12px; text-align: center; }
      .event-overlay .details svg { width: 16px; height: 16px; vertical-align: middle; margin-right: 4px; }
      .event-overlay .buttons { display: flex; flex-direction: column; gap: 8px; width: 100%; }
      .event-overlay .details-btn, .event-overlay .map-btn { display: flex; align-items: center; gap: 8px; background: #DE9E67; color: #270903; border: none; border-radius: 8px; padding: 10px 16px; font-size: 14px; font-weight: 700; font-family: 'IBMPlexMono', monospace; cursor: pointer; transition: background 0.3s ease; }
      .event-overlay .details-btn:hover, .event-overlay .map-btn:hover { background: #F0E89D; }
      .event-overlay .details-btn.disabled { background: #999; cursor: not-allowed; }
      .event-overlay .close { position: absolute; top: 12px; left: 12px; background: transparent; border: none; color: #FCEBDE; font-size: 24px; cursor: pointer; transition: color 0.3s ease; }
      .event-overlay .close:hover { color: #DE9E67; }
      .event-overlay .swiper { display: flex; justify-content: space-between; width: 100%; margin: 8px 0; }
      .event-overlay .swiper-btn { background: #270903; color: #FCEBDE; border: 1px solid #DE9E67; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
      .event-overlay .swiper-btn:hover { background: #DE9E67; color: #270903; }
      .event-overlay .swiper-btn svg { width: 20px; height: 20px; }

      @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

      @media (max-width: 1024px) {
        .event-overlay { max-width: 340px; min-height: 360px; bottom: 25%; padding: 16px; }
        .event-overlay img { max-width: 260px; }
        .event-overlay h2 { font-size: 18px; }
        .event-overlay .details { font-size: 13px; }
        .controls { top: 15px; right: 15px; gap: 8px; }
        .control-btn { padding: 6px 12px; font-size: 13px; }
      }

      @media (max-width: 768px) {
        .event-overlay { max-width: 320px; min-height: 340px; bottom: 30%; padding: 12px; }
        .event-overlay img { max-width: 240px; }
        .event-overlay h2 { font-size: 16px; }
        .event-overlay .details { font-size: 12px; }
        .controls { top: 10px; right: 10px; flex-direction: column; }
        .control-btn { padding: 6px 10px; font-size: 12px; }
      }

      @media (max-width: 480px) {
        .event-overlay { max-width: 300px; min-height: 320px; bottom: 35%; padding: 10px; }
        .event-overlay img { max-width: 220px; }
        .event-overlay h2 { font-size: 14px; }
        .event-overlay .details { font-size: 11px; }
        .controls { top: 25px; right: 8px; }
        .control-btn { width: 80px; height: 38px; padding: 6px 10px; font-size: 11px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .control-btn svg { width: 16px; height: 16px; }
        .play-btn { width: 32px; height: 32px; padding: 6px; border-radius: 50%  margin-left: 15px; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Automatic event transition
  useEffect(() => {
    if (!isPlaying) return;
    const upcomingEvents = EVENTS.filter((e) => e.type === "upcoming");
    const pastEvents = EVENTS.filter((e) => e.type === "past");
    const allEvents = [...upcomingEvents, ...pastEvents];

    const transition = () => {
      const ev = allEvents[eventIndex];
      setSelectedEvent(ev);
      if (isFlat) {
        setViewport((v) => ({ ...v, latitude: ev.lat, longitude: ev.lng, zoom: 12 }));
      } else if (globeRef.current) {
        globeRef.current.pointOfView({ lat: ev.lat, lng: ev.lng, altitude: 0.6 }, 1000);
      }
      setEventIndex((prev) => (prev + 1) % allEvents.length);
    };

    const interval = setInterval(transition, 8000); // Changed to 8 seconds
    return () => clearInterval(interval);
  }, [isPlaying, isFlat, eventIndex]);

  // Resume auto-play after 5 seconds of inactivity
  useEffect(() => {
    if (isPlaying) return;
    const timeout = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction >= 5000) {
        setIsPlaying(true);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [lastInteraction, isPlaying]);

  // Globe setup
  useEffect(() => {
    if (!globeRef.current || isFlat) return;
    const globe = globeRef.current;
    const controls = typeof globe.controls === 'function' ? globe.controls() : globe.controls;
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.25;
      controls.enableZoom = true;
      controls.minDistance = 200;
      controls.maxDistance = 400;
    }

    const scene = typeof globe.scene === 'function' ? globe.scene() : globe.scene;
    if (scene) {
      scene.background = new THREE.Color('#FCEBDE'); // Vanilla background
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
      directionalLight.position.set(100, 100, 100);
      scene.add(ambientLight, directionalLight);

      // Apply Coffee-colored material to the globe
      const globeMesh = typeof globe.globeMesh === 'function' ? globe.globeMesh() : globe.globeMesh;
      if (globeMesh) {
        const coffeeMaterial = new THREE.MeshStandardMaterial({
          color: '#451F17', // Coffee color
          roughness: 0.8,
          metalness: 0.2,
        });
        globeMesh.material = coffeeMaterial;
      }
    }
  }, [isFlat]);

  const makeMarker = (ev) => {
    const wrap = document.createElement("div");
    wrap.className = `espresso-marker ${ev.type}`;
    wrap.innerHTML = `
      ${ev.type === "past" ? pastCupSvg : upcomingCupSvg}
      <div class="label">${ev.name}</div>
    `;
    wrap.onclick = (e) => {
      e.stopPropagation();
      setSelectedEvent(ev);
      setIsPlaying(false);
      setLastInteraction(Date.now());
      setEventIndex(EVENTS.findIndex((event) => event.id === ev.id));
      if (isFlat) {
        setViewport((v) => ({ ...v, latitude: ev.lat, longitude: ev.lng, zoom: 12 }));
      } else if (globeRef.current) {
        globeRef.current.pointOfView({ lat: ev.lat, lng: ev.lng, altitude: 0.6 }, 1000);
      }
    };
    return wrap;
  };

  const handleSwipe = (direction) => {
    setIsPlaying(false);
    setLastInteraction(Date.now());
    const upcomingEvents = EVENTS.filter((e) => e.type === "upcoming");
    const pastEvents = EVENTS.filter((e) => e.type === "past");
    const allEvents = [...upcomingEvents, ...pastEvents];
    let newIndex = eventIndex;
    if (direction === "next") {
      newIndex = (eventIndex + 1) % allEvents.length;
    } else {
      newIndex = (eventIndex - 1 + allEvents.length) % allEvents.length;
    }
    setEventIndex(newIndex);
    const ev = allEvents[newIndex];
    setSelectedEvent(ev);
    if (isFlat) {
      setViewport((v) => ({ ...v, latitude: ev.lat, longitude: ev.lng, zoom: 12 }));
    } else if (globeRef.current) {
      globeRef.current.pointOfView({ lat: ev.lat, lng: ev.lng, altitude: 0.6 }, 1000);
    }
  };

  const htmlElementsData = useMemo(() => EVENTS.map((e) => ({ ...e })), []);

  return (
    <div className="map-container">
      {/* Logo */}
      <div style={{ position: "absolute", left: 20, top: 20, zIndex: 100 }}>
        <img src={espressoLogo} alt="Espresso Logo" style={{ width: 120, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} />
      </div>

      {/* Controls */}
      <div className="controls">
        <button
          className="control-btn"
          onClick={() => {
            setIsFlat((v) => !v);
            setLastInteraction(Date.now());
          }}
          title={isFlat ? "Switch to Globe View" : "Switch to Flat View"}
        >
          {isFlat ? "Toggle Globe" : "Toggle Flat"}
        </button>
        <button
          className="control-btn play-btn"
          onClick={() => {
            setIsPlaying((p) => !p);
            setLastInteraction(Date.now());
          }}
          title={isPlaying ? "Pause Transitions" : "Play Transitions"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M6 4C6 3.44772 6.44772 3 7 3H10V21H7C6.44772 21 6 20.5523 6 20V4ZM14 3C13.4477 3 13 3.44772 13 4V20C13 20.5523 13.4477 21 14 21H17V3H14Z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M5 3V21L19 12L5 3Z"/></svg>
          )}
        </button>
      </div>

      {/* Map/Globe */}
      {isFlat ? (
        <Map
          {...viewport}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          projection={{ name: "mercator" }}
          onMove={(evt) => setViewport(evt.viewState)}
        >
          <NavigationControl position="bottom-right" />
          {EVENTS.map((ev) => (
            <Marker key={ev.id} latitude={ev.lat} longitude={ev.lng}>
              <div className={`espresso-marker ${ev.type}`} dangerouslySetInnerHTML={{ __html: ev.type === "past" ? pastCupSvg + `<div class="label">${ev.name}</div>` : upcomingCupSvg + `<div class="label">${ev.name}</div>` }} />
            </Marker>
          ))}
        </Map>
      ) : (
        <Globe
          key="globe"
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="#FCEBDE"
          htmlElementsData={htmlElementsData}
          htmlElement={(d) => makeMarker(d)}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}

      {/* Event Overlay */}
      {selectedEvent && (
        <div className="event-overlay">
          <button className="close" onClick={() => setSelectedEvent(null)}>×</button>
          <img src={selectedEvent.image || "https://via.placeholder.com/400x300"} alt={selectedEvent.name} />
          <div className="swiper">
            <button className="swiper-btn" onClick={() => handleSwipe("prev")} title="Previous Event">
              <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M15 5L7 12L15 19V5Z"/></svg>
            </button>
            <button className="swiper-btn" onClick={() => handleSwipe("next")} title="Next Event">
              <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M9 5V19L17 12L9 5Z"/></svg>
            </button>
          </div>
          <div className="tag">{selectedEvent.type === "past" ? "Past Event" : "Upcoming Event"}</div>
          <h2>{selectedEvent.name}</h2>
          <div className="details">
            <div>
              <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3ZM7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z"/></svg>
              {selectedEvent.date}
            </div>
            {selectedEvent.country && (
              <div>
                <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/></svg>
                {selectedEvent.country}
              </div>
            )}
            {selectedEvent.attendees && (
              <div>
                <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C13.67 13 9 14.17 9 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"/></svg>
                {selectedEvent.attendees} Attendees
              </div>
            )}
            {selectedEvent.location && (
              <div>
                <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/></svg>
                {selectedEvent.location}
              </div>
            )}
            {selectedEvent.time && (
              <div>
                <svg viewBox="0 0 24 24" fill="#FCEBDE"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V13L16.55 16.55L17.55 14.93L12.5 12V7Z"/></svg>
                {selectedEvent.time}
              </div>
            )}
          </div>
          <div className="buttons">
            {selectedEvent.id === "seoul" && (
              <button
                className="map-btn"
                onClick={() => window.open(selectedEvent.mapLink, "_blank")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#270903">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
                </svg>
                View on Map
              </button>
            )}
            <button
              className={`details-btn ${selectedEvent.id === "buenos" ? "disabled" : ""}`}
              onClick={selectedEvent.id !== "buenos" ? () => window.open(selectedEvent.link, "_blank") : undefined}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#270903">
                <path d="M18 7H6C4.89543 7 4 7.89543 4 9V15C4 16.1046 4.89543 17 6 17H18C19.1046 17 20 16.1046 20 15V9C20 7.89543 19.1046 7 18 7Z" />
                <path d="M20 10H22C22.5523 10 23 10.4477 23 11V13C23 13.5523 22.5523 14 22 14H20V10Z" />
              </svg>
              {selectedEvent.type === "past" ? "Event Details" : "Join Event"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}