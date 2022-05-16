import React from "react";
import Radium from "radium";
import { useEffect, useState } from "react";
import { Button, Text, Title } from "@mantine/core";
import { useDocument } from "swr-firestore-v9";
import moment from "moment";

import TrainCalendar from "./sub-components/trainCalendar";
import DepartureCheckbox from "./sub-components/departureCheckbox";
import DaysCalendar from "./sub-components/daysCalendar";

const IndexTrip = ({ currentTrip, trips }) => {
  const { update } = useDocument(`admin/botSettings`, {
    listen: true,
    ignoreFirestoreDocumentSnapshotField: true,
  });
  const [tripDates, setTripDates] = useState([false, null]);
  const [departures, setDepartures] = useState([false, null]);
  const [departureDates, setDepartureDates] = useState([false, null]);
  const [returnDates, setReturnDates] = useState([false, null]);
  useEffect(() => {
    if (currentTrip) {
      setDepartures((departures) => [departures[0], currentTrip.departures]);
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
      id: `${tripDates[1][0]}.${tripDates[1][1]}`,
    };

    if (
      tripDates[1] &&
      tripDates[1][0] !== currentTrip.maxDeparture &&
      tripDates[1][1] !== currentTrip.maxReturn
    ) {
      call = true;
    }

    if (departures[1] && departures[1] !== currentTrip.departures) call = true;

    if (departureDates[1] && departureDates[1] !== currentTrip.departureDates)
      call = true;

    if (returnDates[1] && returnDates[1] !== currentTrip.returnDates)
      call = true;

    if (call) {
      console.log("updating");
      update(
        {
          trips: trips.map((trip) => {
            if (trip.id === currentTrip.id) {
              let found = false;
              trips.map((trip) => {
                if (trip.id === newTrip.id) found = true;
              });
              if (!found) return { ...newTrip };
            }
            return trip;
          }),
        },
        { merge: true }
      );
    }
  }, [tripDates[1], departures[1], departureDates, returnDates]);

  return (
    <div style={styles.selectedTripContainer}>
      {currentTrip.id !== "new" ? (
        <Title align="center">
          {`${moment(currentTrip.maxDeparture).format("DD-MM-YYYY")} - 
        ${moment(currentTrip.maxReturn).format("DD-MM-YYYY")}`}
        </Title>
      ) : (
        <Title align="center">
          {`${currentTrip.maxDeparture} - ${currentTrip.maxReturn}`}
        </Title>
      )}
      {}
      <div>
        <div style={styles.parameters}>
          <div style={styles.optionContainer}>
            <Button
              onClick={() =>
                setTripDates((showDepartureDate) => [
                  !showDepartureDate[0],
                  showDepartureDate[1],
                ])
              }
            >
              Changer date de debut/fin
            </Button>
            {(tripDates[0] || currentTrip.id === "new") && (
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
        <div style={styles.parameters}>
          <div style={styles.optionContainer}>
            <Button
              disabled={departureDates[1] ? false : true}
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
              disabled={returnDates[1] ? false : true}
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
    </div>
  );
};
const styles = {
  selectedTripContainer: {
    width: "120%",
  },
  optionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  parameters: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "30px",
  },
};

export default Radium(IndexTrip);
