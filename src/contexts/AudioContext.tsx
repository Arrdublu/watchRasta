"use client";

import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';

interface AudioContextType {
  track: any; // Replace 'any' with your track type
  isPlaying: boolean;
  play: (track: any) => void;
  pause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [track, setTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = (newTrack: any) => {
    if (audioRef.current) {
        if (track && track.id === newTrack.id) {
            audioRef.current.play();
        } else {
            setTrack(newTrack);
            audioRef.current.src = newTrack.url; // Assuming track object has a URL property
            audioRef.current.play();
        }
        setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ track, isPlaying, play, pause, audioRef }}>
      {children}
      <audio ref={audioRef} />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
