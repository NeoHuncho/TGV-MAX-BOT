import Radium from "radium";

import { useEffect, useState } from "react";
import { Button, Text, Title } from "@mantine/core";
import { useDocument } from "swr-firestore-v9";
import moment from "moment";
import Image from "next/image";
import TrainCalendar from "./trainCalendar";
import DepartureCheckbox from "./departureCheckbox";
import DaysCalendar from "./daysCalendar";
const Trips = () => {
  const { data, update } = useDocument(`admin/botSettings`, {
    listen: true,
    ignoreFirestoreDocumentSnapshotField: true,
  });
  
  const [trips, setTrips] = useState((data && data.trips) || []);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripDates, setTripDates] = useState([false, null]);
  const [departures, setDepartures] = useState([false, null]);
  const [departureDates, setDepartureDates] = useState([false, null]);
  const [returnDates, setReturnDates] = useState([false, null]);

  useEffect(() => {
    if (data?.trips) setTrips(data.trips);
    if (currentTrip) {
      setCurrentTrip(
        (currentTrip) =>
          data.trips.filter((trip) => {
            if (trip.id === currentTrip.id) return true;
            else return false;
          })[0]
      );
    }
  }, [data]);

  useEffect(() => {
    if (currentTrip) {
      setDepartures((departures) => [departures[0], currentTrip.departures]);
      setTripDates((tripDate) => [
        tripDate[0],
        [currentTrip.maxDeparture, currentTrip.maxReturn],
      ]);
      setDepartureDates([false, currentTrip.departureDate]);
      setReturnDates([false, currentTrip.returnDate]);
    }
  }, [currentTrip]);

  useEffect(() => {
    if (!currentTrip) return;

    if (
      tripDates[1] &&
      tripDates[1] !== [currentTrip.maxDeparture, currentTrip.maxReturn]
    ) {
      update(
        {
          trips: trips.map((trip) => {
            if (trip.id === currentTrip.id) {
              return {
                ...trip,
                departureDate: [tripDates[1][0]],
                returnDate: [tripDates[1][1]],
                maxDeparture: tripDates[1][0],
                maxReturn: tripDates[1][1],
              };
            }
            return trip;
          }),
        },
        { merge: true }
      );
    }
    if (departures[1] && departures[1] !== currentTrip.departures) {
      update(
        {
          trips: trips.map((trip) => {
            if (trip.id === currentTrip.id) {
              return {
                ...trip,
                departures: departures[1],
              };
            }
            return trip;
          }),
        },
        { merge: true }
      );
    }
  }, [tripDates, departures, departureDates, returnDates]);

  return (
    <div style={styles.container}>
      <div>
        {trips.map((trip) => {
          return (
            <div
              onClick={() =>
                setCurrentTrip((currentTrip) => {
                  !currentTrip
                    ? setCurrentTrip(trip)
                    : currentTrip !== trip
                    ? setCurrentTrip(trip)
                    : setCurrentTrip(null);
                })
              }
              style={styles.tripContainer}
            >
              <Text size="lg" weight={500}>
                {`${moment(trip.departureDate[0]).format("DD-MM-YYYY")} - 
            ${moment(trip.returnDate[0]).format("DD-MM-YYYY")}`}
              </Text>
              <Image src="/icons/edit.svg" width={15} height={15} />
            </div>
          );
        })}
      </div>
      <div>
        {currentTrip && (
          <div style={styles.selectedTripContainer}>
            <Title align="center">
              {`${moment(currentTrip.departureDate[0]).format("DD-MM-YYYY")} - 
            ${moment(currentTrip.returnDate[0]).format("DD-MM-YYYY")}`}
            </Title>
            <div>
              <div style={styles.parameters}>
                <div>
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
                  {tripDates[0] && (
                    <TrainCalendar
                      tripDates={tripDates}
                      setTripDates={setTripDates}
                    />
                  )}
                </div>
                <div>
                  <Button
                    onClick={() =>
                      setDepartures((departures) => [
                        !departures[0],
                        departures[1],
                      ])
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
                <div>
                  <Button
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
                      setReturnDates={setReturnDates}
                    />
                  )}
                </div>
                <div>
                  <Button
                    onClick={() =>
                      setReturnDates((departures) => [
                        !departures[0],
                        departures[1],
                      ])
                    }
                  >
                    Dates de retours
                  </Button>
                  {returnDates[0] && (
                    <DaysCalendar
                      departureDates={departureDates}
                      setDepartureDates={setDepartureDates}
                      returnDates={returnDates}
                      setReturnDates={setReturnDates}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    gap: "10vw",
  },
  tripContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  selectedTripContainer: {
    width: "120%",
  },
  parameters: {
    display: "flex",

    justifyContent: "space-around",
    marginTop: "30px",
  },
};

export default Radium(Trips);
