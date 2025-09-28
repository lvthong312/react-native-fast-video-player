# react-native-fast-video

Support for Video

## Installation


```sh
npm install react-native-fast-video
```


## Usage


```js
import { View } from 'react-native';
import { FastVideo } from 'react-native-fast-video';

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
