import React from 'react';
import { useRef, useEffect } from 'react';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  isPlaying,
  volume,
  onTogglePlay,
  onVolumeChange,
  onTimeUpdate,
  onDurationChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && channel) {
      videoRef.current.src = channel.url;
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);
      if (isPlaying) {
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);
        videoRef.current.play().catch(console.error);
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };
      }
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      onDurationChange(videoRef.current.duration);
    }
  };
    }
  if (!channel) {
    return (
      <div className="w-full h-64 bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">No channel selected</p>
      </div>
    );
  }
  }, [channel]);
  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => onTogglePlay()}
        onPause={() => onTogglePlay()}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};