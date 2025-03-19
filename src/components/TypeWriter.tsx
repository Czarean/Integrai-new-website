import React, { useState, useEffect, useCallback } from 'react';

interface TypeWriterProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  delay = 50,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const startTyping = useCallback(() => {
    setDisplayText('');
    setIsTyping(true);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      const type = () => {
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text[currentIndex]);
          currentIndex++;
          timeoutId = setTimeout(type, delay);
        } else {
          setIsTyping(false);
          onComplete?.();
        }
      };

      timeoutId = setTimeout(type, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [text, delay, isTyping, onComplete]);

  return (
    <div className={`relative ${className}`}>
      <pre className="font-mono whitespace-pre-wrap break-words">
        {displayText}
        <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-[blink_1s_infinite]" />
      </pre>
    </div>
  );
};

export default TypeWriter;