import { useRef, useState, type ReactElement, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  Platform,
} from 'react-native';
import Video, {
  type OnLoadData,
  type ReactVideoSource,
  type VideoRef,
} from 'react-native-video';
import { VideoControls } from './VideoControls';
import {
  lockToLandscape,
  unlockAllOrientations,
} from 'react-native-fast-orientation-locker';
interface FastVideoProps {
  source: ReactVideoSource;
  watermarkText: string;
  watermarkStyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
  OverLayComponent?: ReactElement;
}
export default function FastVideo({
  source,
  watermarkText,
  watermarkStyle,
  style,
  OverLayComponent,
}: FastVideoProps) {
  const smallRef = useRef<VideoRef>(null);
  const fullRef = useRef<VideoRef>(null);
  const [isEnded, setEnded] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const handleTogglePlay = () => {
    if (paused) {
      if (isFullscreen) {
        fullRef.current?.resume();
      } else {
        smallRef.current?.resume();
      }
    } else {
      if (isFullscreen) {
        fullRef.current?.pause();
      } else {
        smallRef.current?.pause();
      }
    }
    setPaused((prev) => !prev);
  };
  useEffect(() => {
    return () => {
      if (Platform.OS === 'android') {
        unlockAllOrientations();
      }
    };
  }, []);
  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (isFullscreen) {
      fullRef.current?.seek(time);
    } else {
      smallRef.current?.seek(time);
    }
  };
  const handleOpenFullscreen = () => {
    smallRef.current?.pause();
    setFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    if (Platform.OS === 'android') {
      unlockAllOrientations();
    }
    setFullscreen(false);
    smallRef.current?.seek(currentTime);
    smallRef.current?.resume();
    setFullscreen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Video nhỏ */}
      <TouchableOpacity>
        <Video
          ref={smallRef}
          source={{
            ...source,
            shouldCache: true,
          }}
          style={[
            { width: '100%', height: 200, backgroundColor: 'black' },
            style,
          ]}
          resizeMode="contain"
          onProgress={(data) => {
            setCurrentTime(data.currentTime);
          }}
          onLoad={(data: OnLoadData) => setDuration(data.duration)}
          onEnd={() => {
            setEnded(true);
            setPaused(true);
          }}
          muted={muted}
        />
        <VideoControls
          paused={paused}
          duration={duration}
          currentTime={currentTime}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          onToggleFullscreen={handleOpenFullscreen}
          onReplay={() => {
            smallRef.current?.seek(0);
            setEnded(false);
            setPaused(false);
          }}
          isEnded={isEnded}
          muted={muted}
          onToggleMute={() => setMuted(!muted)} // 👈 toggle audio
        />
        <Text style={[styles.overlayText, watermarkStyle]}>
          {watermarkText}
        </Text>
        <View style={{ position: 'absolute' }}>{OverLayComponent}</View>
      </TouchableOpacity>

      {/* Fullscreen Modal */}
      <Modal
        visible={isFullscreen}
        onShow={() => {
          // khi modal mở → seek đến thời gian trước đó
          if (Platform.OS === 'android') {
            lockToLandscape?.();
          }
        }}
        onRequestClose={() => {}}
        supportedOrientations={['landscape']}
        statusBarTranslucent
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <Video
            ref={fullRef}
            source={{
              ...source,
              shouldCache: true,
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
            onProgress={(data) => {
              setCurrentTime(data.currentTime);
            }}
            onLoad={(data: OnLoadData) => {
              fullRef.current?.seek(currentTime);
              setDuration(data.duration);
            }}
            onEnd={() => {
              setEnded(true);
              setPaused(true);
            }}
            muted={muted}
          />
          <VideoControls
            paused={paused}
            duration={duration}
            currentTime={currentTime}
            onTogglePlay={handleTogglePlay}
            onSeek={handleSeek}
            onToggleFullscreen={handleOpenFullscreen}
            isFullscreen
            onCloseFullscreen={handleCloseFullscreen}
            onReplay={() => {
              fullRef.current?.seek(0);
              setEnded(false);
              setPaused(false);
            }}
            isEnded={isEnded}
            muted={muted}
            onToggleMute={() => setMuted(!muted)} // 👈 toggle audio
          />
          <Text style={[styles.overlayText, watermarkStyle]}>
            {watermarkText}
          </Text>
          <View style={{ position: 'absolute' }}>{OverLayComponent}</View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  overlayText: {
    position: 'absolute',
    color: 'white',
  },
});
