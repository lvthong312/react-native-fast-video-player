import { View } from 'react-native';
import { FastVideo } from 'react-native-fast-video-player';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <FastVideo
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
        watermarkText="This is a sample overlay text"
      />
    </View>
  );
}
