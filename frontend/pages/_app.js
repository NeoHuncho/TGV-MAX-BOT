import "firebase/firestore";
import { initializeApp } from "firebase/app";
import "firebase/app";
import "firebase/auth";
import { Fuego, FuegoProvider } from "swr-firestore-v9";

const firebaseConfig = {
  apiKey: "AIzaSyBOgUowl906XNZKkpKHOYl3d_XCQ3Jw528",
  authDomain: "tgv-max-weekends.firebaseapp.com",
  projectId: "tgv-max-weekends",
  storageBucket: "tgv-max-weekends.appspot.com",
  messagingSenderId: "161848543916",
  appId: "1:161848543916:web:60752012ddaec0eb22ed09",
};

const fuego = new Fuego(firebaseConfig);
initializeApp(firebaseConfig);

function MyApp({ Component, pageProps }) {
  return (
    <FuegoProvider fuego={fuego}>
      <Component {...pageProps} />
    </FuegoProvider>
  );
}

export default MyApp;
