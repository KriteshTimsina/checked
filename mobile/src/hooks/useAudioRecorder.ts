import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

interface RecordingItem {
  uri: string;
  timestamp: number;
  label: string;
  duration: number;
}

const useAudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [currentSound, setCurrentSound] = useState<Audio.Sound>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  // Cleanup sound when it changes
  useEffect(() => {
    return currentSound
      ? () => {
          console.log('Unloading Sound');
          currentSound.unloadAsync();
        }
      : undefined;
  }, [currentSound]);
  async function startRecording() {
    try {
      // Request permission if not granted
      if (permissionResponse!.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      // Track start time
      const startTime = Date.now();
      setRecordingStartTime(startTime);
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  async function stopRecording() {
    if (!recording || !recordingStartTime) return;
    console.log('Stopping recording..');
    // Calculate duration
    const duration = Date.now() - recordingStartTime;
    setRecording(undefined);
    setRecordingStartTime(undefined);
    await recording.stopAndUnloadAsync();
    // Reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    // Get URI and add to recordings array
    const uri = recording.getURI();
    if (uri) {
      setRecordings(prev => [
        ...prev,
        {
          uri,
          timestamp: Date.now(),
          label: `Recording ${prev.length + 1}`,
          duration, // Store duration in milliseconds
        },
      ]);
      console.log('Recording stopped and stored at', uri);
      console.log(`Recording duration: ${duration}ms`);
    }
  }
  async function playSound(uri?: string) {
    // If no URI provided, play the most recent recording
    const targetUri = uri || recordings[recordings.length - 1]?.uri;
    if (!targetUri) {
      console.log('No recording to play');
      return;
    }
    try {
      console.log('Loading Sound');
      // Stop any currently playing sound
      if (currentSound) {
        setIsPlaying(false);
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: targetUri },
        { shouldPlay: true },
        status => {
          // This callback is called whenever the playback status updates
          if (status.isLoaded) {
            // Check if the sound has finished playing
            if (status.didJustFinish) {
              setIsPlaying(false);
              console.log('Playback finished');
            }
          }
        },
      );

      setIsPlaying(true);
      setCurrentSound(newSound);
      console.log('Playing Sound');
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
  // Helper function to format duration
  function formatDuration(durationMs: number): string {
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  async function deleteRecording(uriToDelete: string) {
    setRecordings(prev => prev.filter(recording => recording.uri !== uriToDelete));
  }
  return {
    startRecording,
    stopRecording,
    playSound,
    deleteRecording,
    recording,
    recordings,
    formatDuration,
    isPlaying,
  };
};
export default useAudioRecorder;
