import { Provider } from 'react-redux';
import { store } from './src/Store';
import React from 'react';
import Navigators from "./src/navigators";
import FlashMessage from './src/components/flashMessage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigators />
        <FlashMessage />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;