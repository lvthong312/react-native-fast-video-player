# react-native-fast-video-player
<p align="center">
  <img src="https://img.shields.io/npm/v/react-native-fast-video-player?color=green" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/react-native-fast-video-player" alt="npm downloads" />
  <img src="https://img.shields.io/badge/react--native-0.70+-blue" alt="react-native" />
</p>

Support for Video

## Installation


```sh
npm install react-native-fast-video-player
npm install react-native-video
npm install react-native-fast-orientation-locker
```


## Usage


```js
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

```


## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
