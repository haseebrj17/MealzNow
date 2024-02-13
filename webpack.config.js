const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync({
        env,
        babel: { dangerouslyAddModulePathsToTranspile: ['react-native'] }
    }, argv);

    // Ensure 'react-native' packages are correctly aliased to 'react-native-web'
    config.resolve.alias = {
        ...config.resolve.alias,
        'react-native$': 'react-native-web',
        'node:fs': false, // Mock the fs module, if necessary
        // Correctly point to Platform implementation in 'react-native-web'
        '../Utilities/Platform': 'react-native-web/dist/exports/Platform',
        'react-native/Libraries/LogBox/LogBox.js': 'react-native-web/dist/exports/LogBox/index.js'
    };

    if (config.mode === 'development') {
        config.devServer.compress = false;
    }

    if (config.mode === 'production') {
        config.optimization.minimize = false;
    }

    return config;
};
