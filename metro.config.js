const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      sourceExts: [...sourceExts, 'ts', 'tsx'],
      extraNodeModules: {
        '@tensorflow/tfjs-react-native': require.resolve(
          '@tensorflow/tfjs-react-native/package.json'
        ),
        '@tensorflow/tfjs-core': require.resolve(
          '@tensorflow/tfjs-core/package.json'
        ),
        '@tensorflow/tfjs': require.resolve('@tensorflow/tfjs/package.json'),
        'react-native-fs': require.resolve('react-native-fs'),
      },
    },
  };
})();
