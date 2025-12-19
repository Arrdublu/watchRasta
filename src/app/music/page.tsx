"use client";

import { useAudio } from "@/contexts/AudioContext";
import { PlayIcon } from "@radix-ui/react-icons";

const tracks = [
  {
    id: 1,
    title: "Track 1",
    artist: "Artist 1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    artwork: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Track 2",
    artist: "Artist 2",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    artwork: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Track 3",
    artist: "Artist 3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    artwork: "https://via.placeholder.com/150",
  },
];

const MusicPage = () => {
  const { play } = useAudio();

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Music
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Listen to the latest tracks.
          </p>
        </div>
        <div>
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-4 border-b"
            >
              <div className="flex items-center">
                <img
                  src={track.artwork}
                  alt={track.title}
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h3 className="font-bold">{track.title}</h3>
                  <p className="text-gray-400">{track.artist}</p>
                </div>
              </div>
              <button
                onClick={() => play(track)}
                className="p-2"
              >
                <PlayIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;