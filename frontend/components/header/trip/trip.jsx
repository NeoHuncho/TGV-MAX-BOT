import React from "react";
import Radium from "radium";
import { useEffect, useState, useContext } from "react";
import { Button, Text, Title, Checkbox } from "@mantine/core";
import { useDocument } from "swr-firestore-v9";
import moment from "moment";
import lodash from "lodash";
import TrainCalendar from "./sub-components/trainCalendar";
import DepartureCheckbox from "./sub-components/departureCheckbox";
import DaysCalendar from "./sub-components/daysCalendar";
import cssStyles from "../../responsive.module.css";
import { BotContext } from "context/context";
import formatDate from "@utils/formatDate";
const IndexTrip = ({ currentTrip, trips, isAnonymous }) => {
  const { updateBot: update } = useContext(BotContext);
  const [tripDates, setTripDates] = useState([false, null]);
  const [departures, setDepartures] = useState([false, null]);
  const [departureDates, setDepartureDates] = useState([false, null]);
  const [returnDates, setReturnDates] = useState([false, null]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  useEffect(() => {
    if (currentTrip) {
      setDepartures((departures) => [
        departures[0],
        Object.keys(currentTrip.departures)
          .sort()
          .reduce((r, k) => ((r[k] = currentTrip.departures[k]), r), {}),
      ]);
      setTripDates((tripDate) => [
        tripDate[0],
        [currentTrip.maxDeparture, currentTrip.maxReturn],
      ]);
      setDepartureDates((departure) => [
        departure[0],
        currentTrip.departureDates,
      ]);
      setReturnDates((returnDates) => [
        returnDates[0],
        currentTrip.returnDates,
      ]);
      setFavoritesOnly(currentTrip.favoritesOnly ? true : false);
      // setReturnDates((return)=>[return[0], currentTrip.returnDates])
    }
  }, [currentTrip]);
  useEffect(() => {
    if (
      !currentTrip ||
      !tripDates[1] ||
      !departures[1] ||
      !departureDates[1] ||
      !returnDates[1]
    )
      return;
    let call = false;
    const newTrip = {
      maxDeparture: tripDates[1][0],
      maxReturn: tripDates[1][1],
      departures: departures[1],
      departureDates: departureDates[1],
      returnDates: returnDates[1],
      favoritesOnly: favoritesOnly,
      id: currentTrip.id,
    };

    if (
      tripDates[1] &&
      tripDates[1][0] !== currentTrip.maxDeparture &&
      tripDates[1][1] !== currentTrip.maxReturn
    ) {
      call = true;
    }

    if (departures[1] && !lodash.isEqual(departures[1], currentTrip.departures))
      call = true;

    if (departureDates[1] && departureDates[1] !== currentTrip.departureDates)
      call = true;

    if (returnDates[1] && returnDates[1] !== currentTrip.returnDates)
      call = true;

    if (favoritesOnly !== currentTrip.favoritesOnly) call = true;
    if (call) {
      console.log("updating");
      update(
        {
          trips: trips
            .map((trip) => {
              if (trip.id === currentTrip.id) {
                return { ...newTrip };
              }
              return trip;
            })
            .sort((a, b) => (a.maxReturn > b.maxReturn ? 1 : -1)),
        },
        { merge: true }
      );
    }
  }, [
    tripDates[1],
    departures[1],
    departureDates[1],
    returnDates[1],
    favoritesOnly,
  ]);

  return (
    <div
      className={cssStyles.trip_container}
      style={styles.selectedTripContainer}
    >
      {currentTrip.maxDeparture !== "JJ-MM-AAAA" ? (
        <Title className={cssStyles.date_title} align="center">
          {formatDate(currentTrip.maxDeparture, currentTrip.maxReturn)}
        </Title>
      ) : (
        <Title align="center">
          {`${currentTrip.maxDeparture} - ${currentTrip.maxReturn}`}
        </Title>
      )}
      {}
      <div>
        <div className={cssStyles.trip_params} style={styles.parameters}>
          <div style={styles.optionContainer}>
            <Button
              disabled={isAnonymous}
              onClick={() =>
                setTripDates((showDepartureDate) => [
                  !showDepartureDate[0],
                  showDepartureDate[1],
                ])
              }
            >
              Changer date de debut/fin
            </Button>
            {(tripDates[0] || currentTrip.maxDeparture === "JJ-MM-AAAA") && (
              <TrainCalendar
                tripDates={tripDates}
                setTripDates={setTripDates}
                setDepartureDates={setDepartureDates}
                setReturnDates={setReturnDates}
              />
            )}
          </div>
          <div style={styles.optionContainer}>
            <Button
              disabled={isAnonymous}
              onClick={() =>
                setDepartures((departures) => [!departures[0], departures[1]])
              }
            >
              Changer de gares de depart
            </Button>
            {departures[0] && (
              <DepartureCheckbox
                departures={departures}
                setDepartures={setDepartures}
              />
            )}
          </div>
        </div>
        <div className={cssStyles.trip_params} style={styles.parameters}>
          <div style={styles.optionContainer}>
            <Button
              disabled={departureDates[1] && !isAnonymous ? false : true}
              onClick={() =>
                setDepartureDates((showDepatures) => [
                  !showDepatures[0],
                  showDepatures[1],
                ])
              }
            >
              Dates de départs
            </Button>
            {departureDates[0] && (
              <DaysCalendar
                departureDates={departureDates}
                setDepartureDates={setDepartureDates}
                returnDates={returnDates}
                minmax={[currentTrip.maxDeparture, currentTrip.maxReturn]}
              />
            )}
          </div>
          <div style={styles.optionContainer}>
            <Button
              disabled={returnDates[1] && !isAnonymous ? false : true}
              onClick={() =>
                setReturnDates((departures) => [!departures[0], departures[1]])
              }
            >
              Dates de retours
            </Button>
            {returnDates[0] && (
              <DaysCalendar
                departureDates={departureDates}
                returnDates={returnDates}
                setReturnDates={setReturnDates}
                minmax={[currentTrip.maxDeparture, currentTrip.maxReturn]}
              />
            )}
          </div>
        </div>
      </div>
      <Checkbox
        disabled={isAnonymous}
        style={styles.checkbox}
        label={"Desinations favoris Exclusivement ❤️"}
        checked={favoritesOnly}
        onChange={(event) => setFavoritesOnly(event.target.checked)}
      />
    </div>
  );
};
const styles = {
  selectedTripContainer: {
    width: "120%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  optionContainer: {
    display: "flex",
    flexDirection: "column",
  },
  parameters: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "30px",
    gap: "20px",
  },
  checkbox: {
    marginTop: "20px",
  },
};

export default Radium(IndexTrip);
