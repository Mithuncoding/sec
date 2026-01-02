import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Code, Shield, Database, Palette, Brain, Github, Linkedin, 
  Mail, Star, Award, Zap, Lock, Globe, Terminal, MessageSquare
} from 'lucide-react';

const teamMembers = [
  {
    id: 'mahesh',
    name: 'Mahesh',
    role: 'Team Lead & Full-Stack Developer',
    avatar: '👨‍💻',
    color: 'primary',
    contributions: [
      { icon: Terminal, title: 'Core Architecture', desc: 'Designed the entire application structure and component hierarchy' },
      { icon: Lock, title: 'Encryption Engine', desc: 'Implemented AES-256 encryption and CryptoJS integration' },
      { icon: Database, title: 'Firebase Integration', desc: 'Set up real-time messaging with Firebase Realtime Database' },
      { icon: Brain, title: 'AI Threat Analysis', desc: 'Integrated Gemini AI for intelligent threat detection' }
    ],
    techStack: ['React', 'Firebase', 'CryptoJS', 'Gemini AI'],
    linesOfCode: '~4500',
    quote: '"Security is not a product, but a process."'
  },
  {
    id: 'radhika',
    name: 'Radhika',
    role: 'Frontend Developer & UI/UX Designer',
    avatar: '👩‍🎨',
    color: 'secondary',
    contributions: [
      { icon: Palette, title: 'UI Design System', desc: 'Created the tactical military-grade visual theme' },
      { icon: MessageSquare, title: 'Chat Interface', desc: 'Built the real-time encrypted messaging UI' },
      { icon: Star, title: 'Animations', desc: 'Implemented Framer Motion animations throughout' },
      { icon: Users, title: 'User Experience', desc: 'Designed intuitive navigation and responsive layouts' }
    ],
    techStack: ['React', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons'],
    linesOfCode: '~2800',
    quote: '"Good design is invisible."'
  },
  {
    id: 'suresh',
    name: 'Suresh',
    role: 'Security Researcher & Backend Developer',
    avatar: '🔐',
    color: 'success',
    contributions: [
      { icon: Shield, title: 'Crypto Lab', desc: 'Built the encryption visualization and comparison tools' },
      { icon: Lock, title: 'Password Analyzer', desc: 'Implemented NIST-compliant password strength analysis' },
      { icon: Zap, title: 'Network Monitor', desc: 'Created the intrusion detection simulation system' },
      { icon: Code, title: 'Algorithm Research', desc: 'Researched and documented cryptographic algorithms' }
    ],
    techStack: ['CryptoJS', 'JavaScript', 'Security Research', 'NIST Guidelines'],
    linesOfCode: '~3200',
    quote: '"Trust, but verify."'
  },
  {
    id: 'vaishnavi',
    name: 'Vaishnavi',
    role: 'Frontend Developer & Integration Specialist',
    avatar: '👩‍💻',
    color: 'warning',
    contributions: [
      { icon: Globe, title: 'Geolocator', desc: 'Built the global agent tracking map with Leaflet.js' },
      { icon: Users, title: 'Judge Guide', desc: 'Created the interactive feature documentation panel' },
      { icon: Code, title: 'Component Integration', desc: 'Integrated all modules into cohesive application' },
      { icon: Award, title: 'Testing & QA', desc: 'Performed comprehensive testing and bug fixes' }
    ],
    techStack: ['React', 'Leaflet.js', 'Firebase', 'Testing'],
    linesOfCode: '~2500',
    quote: '"Quality is not an act, it is a habit."'
  }
];

const projectStats = [
  { label: 'Total Lines of Code', value: '~13,000', icon: Code },
  { label: 'Components Built', value: '15+', icon: Terminal },
  { label: 'Algorithms Implemented', value: '6', icon: Lock },
  { label: 'Features Delivered', value: '12+', icon: Star }
];

const TeamPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-auto font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b border-border-strong pb-4 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-primary tracking-widest uppercase flex items-center gap-3">
            <Users className="w-6 h-6" />
            Team_Credits
          </h2>
          <p className="text-xs text-text-muted mt-1">Meet the minds behind SECURE_UPLINK</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Award size={14} className="text-warning" />
          <span>Project Team 2025</span>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {projectStats.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-surface border border-border-strong p-4 text-center"
            >
              <IconComponent className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] text-text-muted uppercase">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
            className={`bg-bg-surface border-2 p-5 cursor-pointer transition-all hover:shadow-lg ${
              selectedMember?.id === member.id 
                ? `border-${member.color} shadow-[0_0_20px_rgba(var(--${member.color}-rgb),0.3)]` 
                : 'border-border-strong hover:border-border-strong/80'
            }`}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 bg-${member.color}/10 border-2 border-${member.color} rounded-lg flex items-center justify-center text-3xl`}>
                {member.avatar}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold text-${member.color}`}>{member.name}</h3>
                <p className="text-xs text-text-muted">{member.role}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-text-muted">
                  <Code size={10} />
                  <span>{member.linesOfCode} lines</span>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {member.techStack.map((tech, j) => (
                <span 
                  key={j} 
                  className={`px-2 py-0.5 text-[10px] border border-${member.color}/30 text-${member.color} bg-${member.color}/5`}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Contributions */}
            <div className="space-y-2">
              {member.contributions.map((contrib, j) => {
                const IconComponent = contrib.icon;
                return (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * j }}
                    className="flex items-start gap-3 p-2 bg-bg-input/50 border border-border-strong/50"
                  >
                    <IconComponent size={14} className={`text-${member.color} mt-0.5 flex-shrink-0`} />
                    <div>
                      <div className="text-xs font-bold text-text-main">{contrib.title}</div>
                      <div className="text-[10px] text-text-muted">{contrib.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quote */}
            <div className={`mt-4 pt-4 border-t border-${member.color}/20`}>
              <p className="text-xs text-text-muted italic">{member.quote}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border-strong text-center">
        <p className="text-xs text-text-muted">
          Built with 💚 using React, Firebase, CryptoJS, and Gemini AI
        </p>
        <p className="text-[10px] text-text-muted mt-2 opacity-50">
          © 2025 SECURE_UPLINK Project Team
        </p>
      </div>
    </div>
  );
};

export default TeamPage;
