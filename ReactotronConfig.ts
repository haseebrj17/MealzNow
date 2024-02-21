// // ReactotronConfig.ts
// import Reactotron, { ReactotronReactNative } from 'reactotron-react-native';
// import { reactotronRedux } from 'reactotron-redux';
// import { ReactotronCore } from 'reactotron-core-client';
//
// // Define an interface that extends both ReactotronReactNative and the plugin features
// interface ReactotronConfigured extends ReactotronReactNative {
//     createEnhancer?: () => any;
// }
//
// let reactotron: ReactotronConfigured | undefined;
//
// if (__DEV__) {
//     reactotron = Reactotron
//         .configure({ name: 'MealzNow' })
//         .useReactNative()
//         .use(reactotronRedux())
//         .connect();
//
//     Reactotron.clear();
//
//     // Extend the console object
//     console.tron = Reactotron;
// }
//
// export default reactotron;
