import axios from "axios-https-proxy-fix";
import { getFirestore } from "firebase-admin/firestore";
import proxyManager from "proxy-manager";
import { appendFile, readFile, writeFile } from "fs/promises";
import jsonSize from "json-size";
import moment from "moment";
import initFirebase from "./initFirebase.js";
import { resolve } from "path";
import toFirstUpperCase from "./utils/toFirstUpperCase.js";
import randomID from "random-id";
import favorites from "./config/favorites.js";
initFirebase();
const fireStore = getFirestore();
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
const nextMonth = moment().add(1, "M").startOf("M").format("YYYY-MM-DD");

let totalErrors = 0;
let currentProxy = parseProxy(proxies.getRandomProxy().toString());
let totalRequests = 0;

const logToFile = async (type, string) => {
  await appendFile("./log/" + type + ".txt", `${moment()}--  ${string}\n`);
};

const makeRequest = async (url) => {
  totalRequests++;
  if (totalRequests % 100 === 0) await logToFile("general", totalRequests);

  try {
    return await axios.get(url, {
      proxy: {
        ...currentProxy,
      },
    });
  } catch (error) {
    try {
      currentProxy = parseProxy(proxies.getRandomProxy().toString());

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

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

const updateTrips = async () => {
  const data =
    (await fireStore.collection("admin").doc("botSettings").get()).data() ||
    null;
  if (data === null) throw console.error("did not find any bot data");
  const trips = data.trips;
  let closestDate = null;

  Object.values(trips).map((trip) => {
    if (closestDate == null) closestDate = trip.maxReturn;
    if (moment(trip.maxReturn) > moment(closestDate))
      closestDate = trip.maxReturn;
  });
  if (!closestDate) closestDate = moment().subtract(2, "m");

  const addTripData = (dates, date) => {
    if (
      moment(date.date) > moment(todaysDate) &&
      moment(date.date).weekday() === 5 &&
      moment(date.date) > moment(closestDate) &&
      date.availability > 0
    ) {
      dates.map((date2) => {
        if (
          moment(date2.date).weekday() === 0 &&
          date2.weekNumber === date.weekNumber &&
          date2.availability > 0
        ) {
          if (
            trips.filter(
              (trip) =>
                trip.maxReturn === date2.date && trip.maxDeparture === date.date
            ).length === 0
          )
            trips.push({
              departureDates: [date.date],
              returnDates: [date2.date],
              maxDeparture: date.date,
              maxReturn: date2.date,
              departures: {
                "LILLE EUROPE": {
                  enabled: true,
                },
                "LILLE FLANDRES": {
                  enabled: true,
                },
                "PARIS (intramuros)": {
                  enabled: true,
                },
              },
              favoritesOnly: false,
              id: randomID(5),
            });
        }
      });
    }
  };

  const dates = (
    await makeRequest(
      `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/PARIS%20(intramuros)/MARSEILLE%20BLANCARDE/0/${todaysDate}`
    )
  ).data;

  const nextMonthdates = (
    await makeRequest(
      `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/PARIS%20(intramuros)/MARSEILLE%20BLANCARDE/0/${nextMonth}`
    )
  ).data;

  dates.map((date) => addTripData(dates, date));
  nextMonthdates.map((date) => addTripData(nextMonthdates, date));

  await fireStore
    .collection("admin")
    .doc("botSettings")
    .set(
      {
        trips: trips.sort((a, b) => (a.maxReturn > b.maxReturn ? 1 : -1)),
      },
      { merge: true }
    );
  return { ...data, trips: trips };
};

const filterNonPairedTrains = (trainsData) => {
  trainsData.departure = trainsData.departure
    .filter((train) => {
      let found = false;
      trainsData.return.map((train2) => {
        if (train.weekNumber === train2.weekNumber) found = true;
      });

      return found;
    })
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.date === value.date)
    );
  trainsData.return = trainsData.return
    .filter((train) => {
      let found = false;
      trainsData.departure.map((train2) => {
        if (train.weekNumber === train2.weekNumber) found = true;
      });

      return found;
    })
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.date === value.date)
    );
  return trainsData;
};

const getRelevantTrains = async (location, days) => {
  let trainsData = {};
  trainsData.departure = (
    await makeRequest(
      `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/${location.departure}/${location.destination}/0/${todaysDate}`
    )
  ).data.filter(
    (train) =>
      moment(train.date) > moment().subtract(1, "d") &&
      train.availability > 0 &&
      days.departure.includes(train.date)
  );
  trainsData.return = (
    await makeRequest(
      `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/${location.destination}/${location.departure}/0/${todaysDate}`
    )
  ).data.filter(
    (train) =>
      moment(train.date) > moment().subtract(1, "d") &&
      train.availability > 0 &&
      days.return.includes(train.date)
  );
  trainsData.departure.push(
    (
      await makeRequest(
        `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/${location.departure}/${location.destination}/0/${nextMonth}`
      )
    ).data.filter(
      (train) =>
        moment(train.date) > moment().subtract(1, "d") &&
        train.availability > 0 &&
        days.departure.includes(train.date)
    )
  );

  trainsData.return.push(
    (
      await makeRequest(
        `https://sncf-simulateur-api-prod.azurewebsites.net/api/Calendar/${location.destination}/${location.departure}/0/${nextMonth}`
      )
    ).data.filter(
      (train) =>
        moment(train.date) > moment().subtract(1, "d") &&
        train.availability > 0 &&
        days.return.includes(train.date)
    )
  );
  trainsData.departure = trainsData.departure.flat();
  trainsData.return = trainsData.return.flat();
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
moment().format("DD-MM-YYYY");
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
        file[key][week][
          `${parseDayNumber(moment(fixedDate).weekday())} (${moment(
            day,
            "DD-MM-YYYY"
          ).format("DD-MM-YYYY")})`
        ] = file[key][week][day];
        delete file[key][week][day];
      }

      file[key][firstDay + " au " + lastDay] = file[key][week];
      delete file[key][week];
    }
    file[toFirstUpperCase(key)] = file[key];
    delete file[key];
  }
  for (const key in file) {
    file[key] = Object.keys(file[key])
      .sort((a, b) => {
        return new Date(b.substring(0, 10)) - new Date(a.substring(0, 10));
      })
      .reduce((r, k) => ((r[k] = file[key][k]), r), {});
  }

  return file;
};

const getTrains = async () => {
  await logToFile("general", "-----START-----");
  const startDate = moment();
  await fireStore
    .collection("admin")
    .doc("botSettings")
    .set({ running: true }, { merge: true });
  const botData = await updateTrips();
  const promises = [];
  botData.departures.forEach((origin) => {
    promises.push(
      new Promise(async (resolve) => {
        const trainsData = {};
        const originDestinations = (
          await makeRequest(
            "https://sncf-simulateur-api-prod.azurewebsites.net/api/Stations/Destinations/" +
              origin
          )
        ).data;
        for (const index in originDestinations) {
          const departureDates = botData.trips
            .map((trip) =>
              trip.departures[origin]?.enabled &&
              (trip.favoritesOnly
                ? favorites.includes(index)
                  ? true
                  : false
                : true)
                ? trip.departureDates
                : null
            )
            .flat()
            .filter((date) => date);

          const returnDates = botData.trips
            .map(
              (trip) =>
                trip.departures[origin]?.enabled &&
                (trip.favoritesOnly
                  ? favorites.includes(index)
                    ? true
                    : false
                  : true)
            )
            .flat()
            .filter((date) => date);

          if (departureDates.length !== 0 && returnDates.length !== 0) {
            const trains = await getRelevantTrains(
              { departure: origin, destination: originDestinations[index] },
              {
                departure: departureDates,
                return: returnDates,
              }
            );
            if (Object.keys(trains).length > 0) {
              trainsData[originDestinations[index]] = trains;
            }
          }
        }
        await writeFile(
          "./outputs/" + origin + ".json",
          JSON.stringify(trainsData)
        );
        await fireStore
          .collection("trains")
          .doc(toFirstUpperCase(origin))
          .set(formatTrainsForFirebase(trainsData))
          .catch(async (error) => await logToFile("errors", error));

        if (totalErrors)
          await logToFile("errors", "Errors found in Requests: " + totalErrors);
        resolve();
      })
    );
  });

  await Promise.all(promises);
  await fireStore
    .collection("admin")
    .doc("botSettings")
    .set(
      { lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"), running: false },
      { merge: true }
    );
  await logToFile(
    "general",
    `total Running Time:  ${moment().diff(startDate, "minutes")} minutes`
  );

  await logToFile("general", "-----END-----");
  process.exit(1);
};

getTrains();
