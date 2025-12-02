import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Target, Wifi } from 'lucide-react';

const Geolocator = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Simulate active agents
    const simulatedAgents = [
      { id: 1, lat: 40.7128, lng: -74.0060, name: 'AGENT_ALPHA', status: 'ONLINE' },
      { id: 2, lat: 51.5074, lng: -0.1278, name: 'AGENT_BRAVO', status: 'IDLE' },
      { id: 3, lat: 35.6762, lng: 139.6503, name: 'AGENT_CHARLIE', status: 'ACTIVE' },
      { id: 4, lat: -33.8688, lng: 151.2093, name: 'AGENT_DELTA', status: 'OFFLINE' },
      { id: 5, lat: 55.7558, lng: 37.6173, name: 'AGENT_ECHO', status: 'WARNING' },
    ];
    setAgents(simulatedAgents);
  }, []);

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
      <div className="flex-1 relative bg-bg-input border border-border-strong rounded-lg overflow-hidden shadow-inner">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--border-strong)_1px,transparent_1px),linear-gradient(90deg,var(--border-strong)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
        
        {/* World Map Placeholder (Stylized) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
           <div className="text-[200px] text-primary font-bold tracking-tighter select-none">WORLD MAP</div>
        </div>

        {/* Agent Markers */}
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            className="absolute"
            style={{
              top: `${(90 - agent.lat) * (100 / 180)}%`,
              left: `${(agent.lng + 180) * (100 / 360)}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: agent.id * 0.2 }}
          >
            <div className="relative group cursor-pointer">
              <MapPin className={`w-6 h-6 ${agent.status === 'ONLINE' || agent.status === 'ACTIVE' ? 'text-success' : agent.status === 'WARNING' ? 'text-warning' : 'text-danger'}`} />
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${agent.status === 'ONLINE' || agent.status === 'ACTIVE' ? 'bg-success animate-ping' : 'bg-danger'}`}></span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-bg-surface border border-primary p-2 hidden group-hover:block z-10 shadow-lg">
                <div className="text-[10px] font-bold text-primary">{agent.name}</div>
                <div className="text-[8px] text-text-muted">STATUS: {agent.status}</div>
                <div className="text-[8px] text-text-muted">COORDS: {agent.lat.toFixed(2)}, {agent.lng.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Scanning Line */}
        <motion.div
            className="absolute top-0 bottom-0 w-1 bg-primary/50 shadow-[0_0_20px_rgba(0,255,65,0.5)]"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Footer Stats */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-bg-surface border border-border-strong p-3 flex items-center justify-between">
            <div className="text-xs text-text-muted">ACTIVE AGENTS</div>
            <div className="text-xl font-bold text-primary">5</div>
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
