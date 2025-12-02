import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const DecryptedText = ({ text, speed = 30, delay = 0, className = '' }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let iteration = 0;
    let interval = null;

    const startScramble = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3; // Slower reveal
      }, speed);
    };

    const timeout = setTimeout(startScramble, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, delay]);

  return (
    <motion.span 
      className={`font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
    </motion.span>
  );
};

export default DecryptedText;
