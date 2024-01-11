import { Provider } from 'react-redux';
import { store } from './src/Store';
import React, { useEffect } from 'react';
import Navigators from "./src/navigators/index.js";
import FlashMessage from './src/components/flashMessage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeDatabase } from './src/db/Db';

const App = () => {

  useEffect(() => {
    initializeDatabase();
  }, []);

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