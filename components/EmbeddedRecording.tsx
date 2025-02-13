import { Pressable, StyleSheet, View } from 'react-native';
import { Recording } from '@/app/(notes)';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import Wave from './Wave';
import useAudioRecorder from '@/hooks/useAudioRecorder';

interface EmbeddedRecordingProps {
  recording: Recording;
  onPlay: (uri: string) => void;
  onDelete: (id: string) => void;
  isPlaying: boolean;
}

export const EmbeddedRecording = ({
  recording,
  onPlay,
  onDelete,
  isPlaying,
}: EmbeddedRecordingProps) => {
  const { formatDuration } = useAudioRecorder();
  return (
    <View style={styles.recordingContainer}>
      <Pressable onPress={() => onPlay(recording.uri)} style={styles.playButton}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color={Colors.light.icon} />
      </Pressable>
      <View style={styles.waveform}>
        <Wave play={isPlaying} />
      </View>
      <ThemedText darkColor={Colors.light.icon} style={styles.duration}>
        {formatDuration(recording.duration)}
      </ThemedText>
      <Pressable onPress={() => onDelete(recording.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={16} color={Colors.light.icon} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  playButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  duration: {
    fontSize: 12,
    marginRight: 8,
  },
  waveform: {
    flex: 1,
    marginHorizontal: 8,
  },
  waveformBar: {
    width: 2,
    backgroundColor: Colors.light.icon,
    marginHorizontal: 1,
  },
});
