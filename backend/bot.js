import axios from "axios-https-proxy-fix";
import { getFirestore } from "firebase-admin/firestore";
import proxyManager from "proxy-manager";
import { readFile, writeFile } from "fs/promises";
import jsonSize from "json-size";
import moment from "moment";
import initFirebase from "./initFirebase.js";

const parseProxy = (proxy) => {
  const file = {
    //   protocol: "https",
    //   host: "152.44.97.146",
    //   port: 8000,
    //   auth: {
    //     username: "6dfbc0hdnea5y7c",
    //     password: "p0JK1ty6",
    //   },
    protocol: "https",
    host: proxy.split(":")[1].split("@")[0].split("//")[1],
    port: proxy.split(":")[2].split("@")[0],
    auth: {
      username: proxy.split("@")[1].split(":")[0],
      password: proxy.split(":")[3],
    },
  };

  return file;
};

const proxies = new proxyManager("proxies.txt");
const todaysDate = moment().format("YYYY-MM-DD");

let totalErrors = 0;

let currentProxy = parseProxy(proxies.getRandomProxy().toString());

const makeRequest = async (url) => {
  try {
    return await axios.get(url, {
      proxy: {
        ...currentProxy,
      },
    });
  } catch (error) {
    try {
      currentProxy = parseProxy(proxies.getRandomProxy().toString());

      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 10000)
      );

      return await axios.get(url, { proxy: { ...currentProxy } });
    } catch (error) {
      totalErrors++;
      return { data: [] };
    }
  }
};

const parseDayNumber = (dayNumber) => {
  if (dayNumber == 0) return "Dimanche";
  if (dayNumber == 1) return "Lundi";
  if (dayNumber == 2) return "Mardi";
  if (dayNumber == 3) return "Mercredi";
  if (dayNumber == 4) return "Jeudi";
  if (dayNumber == 5) return "Vendredi";
  if (dayNumber == 6) return "Samedi";
};

const toFirstUpperCase = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const filterNonPairedTrains = (trainsData) => {
  trainsData.departure = trainsData.departure.filter((train) => {
    let found = false;
    trainsData.return.map((train2) => {
      if (train.weekNumber === train2.weekNumber) found = true;
    });
    return found;
  });
  trainsData.return = trainsData.return.filter((train) => {
    let found = false;
    trainsData.departure.map((train2) => {
      if (train.weekNumber === train2.weekNumber) found = true;
    });
    return found;
  });
  return trainsData;
};

const getRelevantTrains = async (location, days) => {
  let trainsData = {};
  trainsData.departure = (
    await makeRequest(
      `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/${location.depature}/${location.destination}/0/${todaysDate}`
    )
  ).data.filter(
    (train) =>
      moment(train.date) > moment().subtract(1, "d") &&
      train.availability > 0 &&
      days.departure.includes(moment(train.date).weekday())
  );
  trainsData.return = (
    await makeRequest(
      `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/${location.destination}/${location.departure}/0/${todaysDate}`
    )
  ).data.filter(
    (train) =>
      moment(train.date) > moment().subtract(1, "d") &&
      train.availability > 0 &&
      days.return.includes(moment(train.date).weekday())
  );
  trainsData = filterNonPairedTrains(trainsData);
  const departureTrains = trainsData.departure.map(async (day, index) => {
    trainsData.departure[index].trains = [];
    (
      await makeRequest(
        `https://sncf-simulateur-api-prod.azurewebsites.net/api/RailAvailability/Search/${
          location.departure
        }/${location.destination}/${day.date}/${moment(day.date).format(
          "YYYY-MM-DD"
        )}T23:59:59`
      )
    ).data.map((train) => {
      if (train.availableSeatsCount > 0)
        trainsData.departure[index].trains.push({
          departureTime: moment(train.departureDateTime).format("HH:mm"),
          arrivalTime: moment(train.arrivalDateTime).format("HH:mm"),
          seatsLeft: train.availableSeatsCount,
        });
    });
  });
  await Promise.allSettled(departureTrains);
  trainsData.departure = trainsData.departure.filter(
    (day) => day.trains.length > 0
  );

  trainsData = filterNonPairedTrains(trainsData);

  const returnTrains = trainsData.return.map(async (day, index) => {
    trainsData.return[index].trains = [];
    (
      await makeRequest(
        `https://sncf-simulateur-api-prod.azurewebsites.net/api/RailAvailability/Search/${
          location.destination
        }/${location.departure}/${day.date}/${moment(day.date).format(
          "YYYY-MM-DD"
        )}T23:59:59`
      )
    ).data.map((train) => {
      if (train.availableSeatsCount > 0)
        trainsData.return[index].trains.push({
          departureTime: moment(train.departureDateTime).format("HH:mm"),
          arrivalTime: moment(train.arrivalDateTime).format("HH:mm"),
          seatsLeft: train.availableSeatsCount,
        });
    });
  });
  await Promise.allSettled(returnTrains);

  trainsData.return = trainsData.return.filter((day) => day.trains.length > 0);
  trainsData = filterNonPairedTrains(trainsData);
  const sortedTrainsData = {};
  trainsData.departure.map((day) => {
    if (!sortedTrainsData[day.weekNumber])
      sortedTrainsData[day.weekNumber] = {};
    sortedTrainsData[day.weekNumber][moment(day.date).format("DD-MM-YYYY")] =
      day.trains;
  });
  trainsData.return.map((day) => {
    if (!sortedTrainsData[day.weekNumber])
      sortedTrainsData[day.weekNumber] = {};
    sortedTrainsData[day.weekNumber][moment(day.date).format("DD-MM-YYYY")] =
      day.trains;
  });

  // https://sncf-simulateur-api-prod.azurewebsites.net/api/RailAvailability/Search/PARIS%20(intramuros)/AGDE/2022-05-03T00:00:00/2022-05-03T23:59:59
  return sortedTrainsData;
};

const formatTrainsForFirebase = (file) => {
  for (const key in file) {
    for (const week in file[key]) {
      let firstDay = null;
      let lastDay = null;
      Object.keys(file[key][week]).map((day, index) => {
        if (index == 0) firstDay = day;
        if (index == Object.keys(file[key][week]).length - 1) lastDay = day;
      });
      for (const day in file[key][week]) {
        const fixedDate = moment(day, "DD-MM-YYYY").format("YYYY-MM-DD");
        file[key][week][parseDayNumber(moment(fixedDate).weekday())] =
          file[key][week][day];
        delete file[key][week][day];
      }

      file[key][firstDay + " au " + lastDay] = file[key][week];
      delete file[key][week];
    }
    file[toFirstUpperCase(key)] = file[key];
    delete file[key];
  }
  return file;
};

const getTrains = async (origin) => {
  initFirebase();
  const fireStore = getFirestore();

  const trainsData = {};
  const originDestinations = (
    await makeRequest(
      "https://sncf-simulateur-api-prod.azurewebsites.net/api/Stations/Destinations/" +
        origin
    )
  ).data;
  for (const index in originDestinations) {
    const trains = await getRelevantTrains(
      { departure: origin, destination: originDestinations[index] },
      { departure: [4, 5], return: [6, 0] }
    );
    if (file.keys(trains).length > 0) {
      trainsData[originDestinations[index]] = trains;
    }
    await fireStore
      .collection("trains")
      .doc(toFirstUpperCase(origin))
      .set(formatTrainsForFirebase(trainsData));
  }
  console.log("totalErrors: ", totalErrors);
};
getTrains("PARIS (intramuros)");
getTrains("LILLE FLANDRES");
getTrains("LILLE EUROPE");
