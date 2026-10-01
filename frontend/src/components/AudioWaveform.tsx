import React from 'react';

interface AudioWaveformProps {
  color?: string;
  count?: number;
  height?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  color = 'bg-guide-accent',
  count = 5,
  height = 'h-6',
}) => {
  return (
    <div className={`flex items-center justify-center space-x-1 ${height}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <span
          key={idx}
          className={`w-1 rounded-full ${color} ${
            idx % 5 === 0
              ? 'animate-wave-1'
              : idx % 5 === 1
              ? 'animate-wave-2'
              : idx % 5 === 2
              ? 'animate-wave-3'
              : idx % 5 === 3
              ? 'animate-wave-4'
              : 'animate-wave-5'
          }`}
          style={{ height: '100%' }}
        />
      ))}
    </div>
  );
};
