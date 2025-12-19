"use client";

import React, { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Slider } from '@/components/ui/slider';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

const MiniPlayer = () => {
  const { track, isPlaying, play, pause, audioRef } = useAudio();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [audioRef]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(track);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (!track) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src={track.artwork} alt={track.title} className="w-12 h-12 mr-4" />
        <div>
          <h3 className="font-bold">{track.title}</h3>
          <p className="text-gray-400">{track.artist}</p>
        </div>
      </div>
      <div className="flex-grow mx-4 flex items-center">
        <button onClick={handlePlayPause} className="mr-4">
            {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6" />}
        </button>
        <span className="text-xs text-gray-400 mr-2">{formatTime(currentTime)}</span>
        <Slider
            min={0}
            max={duration || 0}
            value={[currentTime]}
            onValueChange={handleSeek}
            className="w-full"
        />
        <span className="text-xs text-gray-400 ml-2">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default MiniPlayer;
