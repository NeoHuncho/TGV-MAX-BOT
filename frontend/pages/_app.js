import "firebase/firestore";
import { initializeApp } from "firebase/app";
import "firebase/app";
import "firebase/auth";
import { Fuego, FuegoProvider } from "swr-firestore-v9";
import { MantineProvider } from "@mantine/core";

const firebase_config = {
  apiKey: process.env.API_KEY,
  authDomain: "tgv-max-weekends.firebaseapp.com",
  projectId: process.env.PROJECT_ID,
  storageBucket: "tgv-max-weekends.appspot.com",
  messagingSenderId: "161848543916",
  appId: process.env.APP_ID,
};

const fuego = new Fuego(firebase_config);
initializeApp(firebase_config);

function MyApp({ Component, pageProps }) {
  return (
    <FuegoProvider fuego={fuego}>
      <MantineProvider
        theme={{ colorScheme: "dark" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Component {...pageProps} />
      </MantineProvider>
    </FuegoProvider>
  );
}

export default MyApp;
