import Slider from '@react-native-community/slider';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ImageBase } from '../images/ImageBase';

type Props = {
  paused: boolean;
  duration: number;
  currentTime: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onToggleFullscreen: () => void;
  isFullscreen?: boolean;
  onCloseFullscreen?: () => void;
  isEnded?: boolean;
  onReplay?: () => void;
  muted: boolean;
  onToggleMute: () => void;
};

export const VideoControls = ({
  paused,
  duration,
  currentTime,
  onTogglePlay,
  onSeek,
  onToggleFullscreen,
  isFullscreen = false,
  onCloseFullscreen,
  isEnded,
  onReplay,
  muted,
  onToggleMute,
}: Props) => {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Overlay icons
  const [showBigIcon, setShowBigIcon] = useState(false);
  const bigIconOpacity = useRef(new Animated.Value(0)).current;

  const [, setShowSeekLeft] = useState(false);
  const seekLeftOpacity = useRef(new Animated.Value(0)).current;

  const [, setShowSeekRight] = useState(false);
  const seekRightOpacity = useRef(new Animated.Value(0)).current;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Auto hide controls
  const showControls = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    hideTimeout.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 3000);
  };

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [paused, isEnded]);

  // Show big play/pause icon
  const triggerBigIcon = () => {
    setShowBigIcon(true);
    bigIconOpacity.setValue(1);

    setTimeout(() => {
      Animated.timing(bigIconOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowBigIcon(false));
    }, 1000);
  };

  // Seek overlay
  const triggerSeek = (dir: 'left' | 'right') => {
    if (dir === 'left') {
      setShowSeekLeft(true);
      seekLeftOpacity.setValue(1);
      setTimeout(() => {
        Animated.timing(seekLeftOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowSeekLeft(false));
      }, 800);
    } else {
      setShowSeekRight(true);
      seekRightOpacity.setValue(1);
      setTimeout(() => {
        Animated.timing(seekRightOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowSeekRight(false));
      }, 800);
    }
  };

  // Double tap handling
  const lastTap = useRef(0);
  const onSeekLeft = () => {
    const newTime = Math.max(currentTime - 10, 0);
    onSeek(newTime);
  };
  const onSeekRight = () => {
    const newTime = Math.max(currentTime + 10, 0);
    onSeek(newTime);
  };
  const handleTapZone = (side: 'left' | 'right') => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // double tap
      if (side === 'left') {
        onSeekLeft();
        triggerSeek('left');
      } else {
        onSeekRight();
        triggerSeek('right');
      }
    } else {
      // single tap = toggle play
      // onTogglePlay();
      triggerBigIcon();
      showControls();
    }
    lastTap.current = now;
  };

  return (
    <View style={styles.overlay}>
      {/* Tap zones */}
      <TouchableWithoutFeedback onPress={() => handleTapZone('left')}>
        <View style={styles.leftZone} />
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => handleTapZone('right')}>
        <View style={styles.rightZone} />
      </TouchableWithoutFeedback>

      {isEnded ? (
        <TouchableOpacity
          onPress={() => {
            onReplay?.();
            showControls();
          }}
        >
          <ImageBase name="ic_replay" size={40} color="white" />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {showBigIcon && (
            <TouchableOpacity onPress={onSeekLeft}>
              <Animated.View style={[{ opacity: bigIconOpacity }]}>
                <ImageBase name="ic_seek_left" size={40} color="white" />
              </Animated.View>
            </TouchableOpacity>
          )}
          {/* Big Play/Pause */}
          {showBigIcon && (
            <TouchableOpacity onPress={onTogglePlay}>
              <Animated.View
                style={[styles.bigIcon, { opacity: bigIconOpacity }]}
              >
                {paused ? (
                  <ImageBase name="ic_play" size={40} color="white" />
                ) : (
                  <ImageBase name="ic_pause" size={40} color="white" />
                )}
              </Animated.View>
            </TouchableOpacity>
          )}
          {showBigIcon && (
            <TouchableOpacity onPress={onSeekRight}>
              <Animated.View style={[{ opacity: bigIconOpacity }]}>
                <ImageBase name="ic_seek_right" size={40} color="white" />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Small controls */}
      <Animated.View
        style={[styles.controls, { opacity: opacity }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <View style={styles.sliderRow}>
          <TouchableOpacity
            onPress={() => {
              showControls();
              onTogglePlay();
            }}
            style={styles.button}
          >
            {paused ? (
              <ImageBase name="ic_play" size={18} color="white" />
            ) : (
              <ImageBase name="ic_pause" size={18} color="white" />
            )}
          </TouchableOpacity>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Slider
            style={{ flex: 1, marginHorizontal: 10 }}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onSlidingStart={showControls}
            onSlidingComplete={(time) => {
              showControls();
              onSeek(time);
            }}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#555"
            thumbTintColor="#fff"
          />
          <Text style={styles.time}>{formatTime(duration)}</Text>
          <TouchableOpacity
            onPress={() => {
              showControls();
              onToggleMute();
            }}
            style={styles.button}
          >
            {muted ? (
              <ImageBase name="ic_volume_off" size={18} color="white" />
            ) : (
              <ImageBase name="ic_volume_on" size={18} color="white" />
            )}
          </TouchableOpacity>
          {isFullscreen ? (
            <TouchableOpacity
              onPress={() => {
                showControls();
                onCloseFullscreen?.();
              }}
              style={styles.button}
            >
              <ImageBase name="ic_close_full_screen" size={18} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                showControls();
                onToggleFullscreen();
              }}
              style={styles.button}
            >
              <ImageBase name="ic_full_screen" size={18} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },
  rightZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },
  bigIcon: {},
  seekOverlay: {
    position: 'absolute',
    fontSize: 32,
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 10,
  },
  leftOverlay: {
    left: 40,
  },
  rightOverlay: {
    right: 40,
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  time: {
    color: 'white',
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 6,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
