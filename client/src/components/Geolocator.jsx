import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe } from 'lucide-react';

const Geolocator = () => {
  // Simulate active agents with real coordinates
  const [agents] = useState([
    { id: 1, lat: 40.7128, lng: -74.0060, name: 'AGENT_ALPHA', status: 'ONLINE', location: 'New York, USA' },
    { id: 2, lat: 51.5074, lng: -0.1278, name: 'AGENT_BRAVO', status: 'IDLE', location: 'London, UK' },
    { id: 3, lat: 35.6762, lng: 139.6503, name: 'AGENT_CHARLIE', status: 'ACTIVE', location: 'Tokyo, JP' },
    { id: 4, lat: -33.8688, lng: 151.2093, name: 'AGENT_DELTA', status: 'OFFLINE', location: 'Sydney, AU' },
    { id: 5, lat: 55.7558, lng: 37.6173, name: 'AGENT_ECHO', status: 'WARNING', location: 'Moscow, RU' },
    { id: 6, lat: 19.0760, lng: 72.8777, name: 'AGENT_FOXTROT', status: 'ONLINE', location: 'Mumbai, IN' },
  ]);

  return (
    <div className="w-full h-full flex flex-col p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-border-strong pb-4">
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase flex items-center gap-3">
          <Globe className="w-6 h-6 animate-pulse" />
          Global_Asset_Tracking
        </h2>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-success">SAT_LINK_ESTABLISHED</span>
          </div>
          <div className="text-text-muted">LATENCY: 24ms</div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-bg-input border border-border-strong rounded-lg overflow-hidden shadow-inner z-0">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* Dark Theme Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Agent Markers */}
          {agents.map((agent) => (
            <CircleMarker 
              key={agent.id}
              center={[agent.lat, agent.lng]}
              pathOptions={{ 
                color: agent.status === 'ONLINE' || agent.status === 'ACTIVE' ? '#00ff41' : agent.status === 'WARNING' ? '#ffa500' : '#ff0000',
                fillColor: agent.status === 'ONLINE' || agent.status === 'ACTIVE' ? '#00ff41' : agent.status === 'WARNING' ? '#ffa500' : '#ff0000',
                fillOpacity: 0.7,
                weight: 1
              }}
              radius={6}
            >
              <Popup className="custom-popup">
                <div className="font-mono text-xs">
                  <strong className="text-primary block mb-1">{agent.name}</strong>
                  <div className="text-gray-600">STATUS: {agent.status}</div>
                  <div className="text-gray-600">LOC: {agent.location}</div>
                  <div className="text-gray-400 text-[10px] mt-1">{agent.lat.toFixed(4)}, {agent.lng.toFixed(4)}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Scanning Line Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]"></div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-surface border border-border-strong p-3 flex items-center justify-between">
            <div className="text-xs text-text-muted">ACTIVE AGENTS</div>
            <div className="text-xl font-bold text-primary">{agents.length}</div>
        </div>
        <div className="bg-bg-surface border border-border-strong p-3 flex items-center justify-between">
            <div className="text-xs text-text-muted">ZONES SECURE</div>
            <div className="text-xl font-bold text-success">98%</div>
        </div>
        <div className="bg-bg-surface border border-border-strong p-3 flex items-center justify-between">
            <div className="text-xs text-text-muted">THREAT LEVEL</div>
            <div className="text-xl font-bold text-warning">LOW</div>
        </div>
        <div className="bg-bg-surface border border-border-strong p-3 flex items-center justify-between">
            <div className="text-xs text-text-muted">UPTIME</div>
            <div className="text-xl font-bold text-secondary">42:19:00</div>
        </div>
      </div>
    </div>
  );
};

export default Geolocator;
