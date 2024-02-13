import { Provider } from 'react-redux';
import { store } from './src/Store';
import React, { useEffect, useState } from 'react';
import Navigators from "./src/navigators/index.js";
import FlashMessage from './src/components/flashMessage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { RealmProvider } from '@realm/react';
import initializeRealm from './src/db/Db';
import LoadingOverlay from './src/components/LoadingOverlay';
import './ReactotronConfig'; // Make sure this is the first import
import { Platform } from 'react-native';


const App = () => {

  const [realmReady, setRealmReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {

        if (Platform.OS !== 'web') {
          await initializeRealm();
          setRealmReady(true);
        }
        setRealmReady(true);
      } catch (error) {
        console.error("Realm initialization error:", error);
      }
    }

    setup();
  }, []);

  if (!realmReady) {
    return (
      <SafeAreaProvider>
        <LoadingOverlay />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GluestackUIProvider config={config}>
          <Navigators />
          <FlashMessage />
        </GluestackUIProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;