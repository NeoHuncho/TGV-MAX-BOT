import React, { useContext, useEffect, useState } from "react";
import { Button, Text, Title, Card } from "@mantine/core";
import { useCollection } from "swr-firestore-v9";
import Radium from "radium";
import Train from "./train/train";
import TrainsHeader from "./header/trainsHeader";
import moment from "node_modules/moment/moment";
import sortFrenchDates from "utils/sortFrenchDates";
import cssStyles from "./responsive.module.css";
import { FiltersContext, TrainsContext } from "context/context";
const TrainList = () => {
  const { dataTrains: data } = useContext(TrainsContext);
  const { filters } = useContext(FiltersContext);
  const [trains, setTrains] = useState(null);
  useEffect(() => {
    if (data) setTrains(data);
  }, [data]);

  return (
    <>
      <TrainsHeader />
      {trains &&
        Object.values(trains)
          .filter(
            (destination) =>
              filters.departures[
                destination.id.includes("Paris")
                  ? "PARIS (intramuros)"
                  : destination.id.toUpperCase()
              ]
          )
          .map((destination, key) => {
            if (Object.keys(destination).length > 4)
              return (
                <div style={styles.container} key={key}>
                  <Title style={styles.title} align="center">
                    {destination.id}
                  </Title>
                  <div
                    className={cssStyles.cards_container}
                    style={styles.cards_container}
                  >
                    {Object.entries(destination)
                      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
                      .map(([destination, trips]) => {
                        if (
                          destination === "id" ||
                          destination === "exists" ||
                          destination === "hasPendingWrites" ||
                          destination === "__snapshot"
                        )
                          return;

                        let sortedTrips = Object.keys(trips)
                          .sort((a, b) =>
                            sortFrenchDates(
                              a.substring(0, 10),
                              b.substring(0, 10)
                            )
                          )
                          .reduce((r, k) => ((r[k] = trips[k]), r), {});
                        return (
                          <Train
                            key={destination}
                            destination={destination}
                            trips={sortedTrips}
                          />
                        );
                      })}
                  </div>
                </div>
              );
          })}
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    borderBottomWidth: "1px",
    borderBottomColor: "White",
    borderBottomStyle: "solid",
  },
  title: {
    marginBottom: "30px",
  },
  cards_container: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridColumnGap: "20px",
    gridRowGap: "40px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },

  tripDates: {},
};

export default Radium(TrainList);
