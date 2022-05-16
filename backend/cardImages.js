import axios from "axios";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
import initFirebase from "./initFirebase.js";
import toFirstUpperCase from "./utils/toFirstUpperCase.js";

initFirebase();
const db = getDatabase().ref("destinations");
const fireStore = getFirestore();

const run = async () => {
  const destinations = [];
  const origins = (
    await fireStore.collection("admin").doc("botSettings").get()
  ).data().departures;

  for (const origin of origins) {
    (
      await axios.get(
        "https://sncf-simulateur-api-prod.azurewebsites.net/api/Stations/Destinations/" +
          origin
      )
    ).data.map((destination) => {
      if (!destinations.includes(destination)) destinations.push(destination);
    });
  }

  for (const index in destinations) {
    const destination = destinations[index];

    const options = {
      method: "GET",
      url: "https://bing-image-search1.p.rapidapi.com/images/search",
      params: { q: destination },
      headers: {
        "X-RapidAPI-Host": "bing-image-search1.p.rapidapi.com",
        "X-RapidAPI-Key": "1752ae6bcfmsh6acd1ad1a96763cp1aa4cajsnd4d242d073f3",
      },
    };

    const results = await axios.request(options).catch(function (error) {
      console.error(error);
    });

    await db.child(toFirstUpperCase(destination)).set({
      image: results.data.value[0].thumbnailUrl,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  console.log("done");
};

run();
