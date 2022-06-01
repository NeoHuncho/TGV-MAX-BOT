import Radium from "radium";

import { useContext, useEffect, useState } from "react";
import { Button, Text, Title } from "@mantine/core";
import { useDocument } from "swr-firestore-v9";
import moment from "moment";
import Image from "next/image";
import randomID from "random-id";
import TripIndex from "./trip/trip";
import { BotContext } from "context/context";
import cssStyles from "./responsive.module.css";
const Trips = () => {
  const { data, update } = useContext(BotContext);

  const [trips, setTrips] = useState((data && data.trips) || []);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [newTrip, setNewTrip] = useState(false);

  useEffect(() => {
    if (newTrip && trips) {
      trips.map((trip) => {
        if (trip.maxDeparture === "JJ-MM-AAAA") {
          setCurrentTrip(trip);
        }
        setNewTrip(false);
      });
    }
  }, [trips, newTrip]);

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

  const deleteCurrentTrip = (trip) => {
    update({
      trips: data.trips.filter((tripDB) => {
        if (trip.id === tripDB.id) return false;
        return true;
      }),
    });
  };

  const createNewTrip = async () => {
    let found = false;
    data.trips.map((trip) => {
      if (trip.maxDeparture === "JJ-MM-AAAA") {
        found = true;
        setNewTrip(true);
      }
    });

    if (!found)
      await update({
        trips: [
          ...data.trips,
          {
            maxDeparture: "JJ-MM-AAAA",
            maxReturn: "JJ-MM-AAAA",
            id: randomID(5),
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
          },
        ].sort((a, b) => (a.maxReturn > b.maxReturn ? 1 : -1)),
      });
    setNewTrip(true);
  };
  console.log(1, currentTrip);
  return (
    <div className={cssStyles.trips_container} style={styles.container}>
      <div style={styles.tripsContainer}>
        {trips.map((trip, key) => {
          return (
            <div key={key} style={styles.tripContainer}>
              <Image
                onClick={() => deleteCurrentTrip(trip)}
                src="/icons/cross.svg"
                width={12}
                height={12}
                style={styles.cross}
              />
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
              >
                <Text size="lg" weight={500}>
                  {`${moment(trip.maxDeparture).format("DD-MM-YYYY")} - 
            ${moment(trip.maxReturn).format("DD-MM-YYYY")}`}
                </Text>
              </div>
            </div>
          );
        })}
        <Button
          onClick={() => {
            createNewTrip();
          }}
          style={styles.addButton}
          color="teal"
        >
          Ajouter dates
        </Button>
      </div>
      <div>
        {currentTrip && <TripIndex trips={trips} currentTrip={currentTrip} />}
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    gap: "10vw",
    justifyContent: "center",
  },
  tripsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  tripContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    cursor: "pointer",
    justifyContent: "center",
  },
  addButton: {
    marginTop: "10px",
    marginLeft: "20px",
    marginRight: "20px",
  },
};

export default Radium(Trips);
