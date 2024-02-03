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

const App = () => {

  const [realmReady, setRealmReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await initializeRealm();
        setRealmReady(true);
      } catch (error) {
        console.error("Realm initialization error:", error);
      }
    }

    setup();
  }, []);

  if (!realmReady) {
    return (
      <LoadingOverlay />
    );
  }

  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        <Navigators />
        <FlashMessage />
      </GluestackUIProvider>
    </Provider>
  );
};

export default App;