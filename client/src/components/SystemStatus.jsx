import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Wifi } from 'lucide-react';

const SystemStatus = () => {
  const [metrics, setMetrics] = useState({
    cpu: 12,
    memory: 45,
    latency: 24,
    entropy: 256
  });
  const [logs] = useState(() => 
    Array.from({ length: 10 }).map(() => 
      `[${new Date().toLocaleTimeString()}] SYNC_PACKET_${Math.floor(Math.random() * 9999)} OK`
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(20, prev.memory + (Math.random() * 5 - 2.5))),
        latency: Math.max(10, prev.latency + (Math.random() * 10 - 5)),
        entropy: 256
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex flex-col gap-4 w-64 p-4 border-l border-border-strong bg-bg-surface/50 backdrop-blur-sm">
      <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-2 flex items-center gap-2">
        <Activity size={14} /> System_Metrics
      </h3>

      {/* CPU Usage */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><Cpu size={10} /> CPU_LOAD</span>
          <span>{metrics.cpu.toFixed(1)}%</span>
        </div>
        <div className="h-1 bg-bg-input rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${metrics.cpu}%` }}
          />
        </div>
      </div>

      {/* Memory Usage */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><Database size={10} /> MEM_ALLOC</span>
          <span>{metrics.memory.toFixed(1)}%</span>
        </div>
        <div className="h-1 bg-bg-input rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500" 
            style={{ width: `${metrics.memory}%` }}
          />
        </div>
      </div>

      {/* Latency */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><Wifi size={10} /> NET_LATENCY</span>
          <span>{metrics.latency.toFixed(0)}ms</span>
        </div>
        <div className="h-1 bg-bg-input rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${metrics.latency > 100 ? 'bg-warning' : 'bg-success'}`}
            style={{ width: `${Math.min(100, metrics.latency)}%` }}
          />
        </div>
      </div>

      {/* Rolling Log (Fake) */}
      <div className="mt-4 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg-surface z-10"></div>
        <div className="text-[8px] font-mono text-text-muted opacity-50 space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="truncate">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
