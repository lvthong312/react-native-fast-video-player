import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Video, {
  type OnLoadData,
  type ReactVideoSource,
  type VideoRef,
} from 'react-native-video';
import { VideoControls } from './VideoControls';

interface FastVideoProps {
  source: ReactVideoSource;
  watermarkText: string;
  watermarkStyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
  OverLayComponent?: ReactElement;
  onFullScreen?: () => void;
  onCloseFullScreen?: () => void;
  waterMaskPosition?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  offsetTop?: number;
  offsetLeft?: number;
  offsetRight?: number;
  offsetBottom?: number;
}
export default function FastVideo({
  source,
  watermarkText,
  watermarkStyle,
  style,
  OverLayComponent,
  onFullScreen,
  onCloseFullScreen,
  waterMaskPosition = 'top-left',
  offsetTop = 0,
  offsetLeft = 0,
  offsetRight = 0,
  offsetBottom = 0,
}: FastVideoProps) {
  const smallRef = useRef<VideoRef>(null);
  const fullRef = useRef<VideoRef>(null);
  const [isEnded, setEnded] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;

  useEffect(() => {
    return () => {
      if (onCloseFullScreen) {
        onCloseFullScreen?.();
      }
    };
  }, []);
  const [videoDimension, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });

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
    if (onCloseFullScreen) {
      onCloseFullScreen?.();
    }
    setFullscreen(false);
    smallRef.current?.seek(currentTime);
    smallRef.current?.resume();
    setFullscreen(false);
  };
  const getWatermarkFullScreenPosition = (
    position: FastVideoProps['waterMaskPosition']
  ): any => {
    const base: ViewStyle = {
      position: 'absolute',
      padding: 8,
    };

    switch (position) {
      case 'top-left':
        return {
          ...base,
          top:
            (isLandscape ? 12 : screenHeight / 2 - videoDimension?.height / 2) +
            offsetTop,
          left: offsetLeft,
        };
      case 'top-center':
        return {
          ...base,
          top:
            (isLandscape ? 12 : screenHeight / 2 - videoDimension?.height / 2) +
            offsetTop,
          alignSelf: 'center',
        };
      case 'top-right':
        return {
          ...base,
          top:
            (isLandscape ? 12 : screenHeight / 2 - videoDimension?.height / 2) +
            offsetTop,
          right: offsetRight,
        };
      case 'bottom-left':
        return {
          ...base,
          bottom:
            (isLandscape ? 12 : screenHeight / 2 - videoDimension?.height / 2) +
            offsetBottom,
          left: offsetLeft,
        };
      case 'bottom-center':
        return {
          ...base,
          bottom:
            (isLandscape ? 12 : screenHeight / 2 - videoDimension?.height / 2) +
            offsetBottom,
          alignSelf: 'center',
        };
      case 'bottom-right':
        return {
          ...base,
          bottom:
            (isLandscape ? 12 : screenHeight / 2 - videoDimension?.height / 2) +
            offsetBottom,
          right: offsetRight,
        };
    }
  };
  const getWatermarkPosition = (
    position: FastVideoProps['waterMaskPosition']
  ): any => {
    const base: ViewStyle = {
      position: 'absolute',
      padding: 8,
    };

    switch (position) {
      case 'top-left':
        return {
          ...base,
          top: offsetTop,
          left: offsetLeft,
        };
      case 'top-center':
        return {
          ...base,
          top: offsetTop,
          alignSelf: 'center',
        };
      case 'top-right':
        return {
          ...base,
          top: offsetTop,
          right: offsetRight,
        };
      case 'bottom-left':
        return {
          ...base,
          bottom: offsetBottom,
          left: offsetLeft,
        };
      case 'bottom-center':
        return {
          ...base,
          bottom: offsetBottom,
          alignSelf: 'center',
        };
      case 'bottom-right':
        return {
          ...base,
          bottom: offsetBottom,
          right: offsetRight,
        };
    }
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
        <Text
          style={[
            styles.overlayText,
            getWatermarkPosition(waterMaskPosition),
            watermarkStyle,
          ]}
        >
          {watermarkText}
        </Text>
        <View style={{ position: 'absolute' }}>{OverLayComponent}</View>
      </TouchableOpacity>

      {/* Fullscreen Modal */}
      <Modal
        visible={isFullscreen}
        onShow={() => {
          // khi modal mở → seek đến thời gian trước đó
          if (onFullScreen) {
            onFullScreen?.();
          }
        }}
        onRequestClose={() => {}}
        supportedOrientations={[
          'portrait',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        statusBarTranslucent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            justifyContent: 'center',
          }}
        >
          <Video
            ref={fullRef}
            source={{
              ...source,
              shouldCache: true,
            }}
            style={{
              width: '100%',
              height: isLandscape ? '100%' : videoDimension?.height,
            }}
            onProgress={(data) => {
              setCurrentTime(data.currentTime);
            }}
            onLoad={(data: OnLoadData) => {
              fullRef.current?.seek(currentTime);
              const aspectRatio =
                data.naturalSize.width / data.naturalSize.height;

              setVideoDimensions({
                width: screenWidth,
                height: screenWidth / aspectRatio,
              });
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
          <Text
            style={[
              styles.overlayText,
              getWatermarkFullScreenPosition(waterMaskPosition),
              watermarkStyle,
            ]}
          >
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
    pointerEvents: 'none',
  },
});
