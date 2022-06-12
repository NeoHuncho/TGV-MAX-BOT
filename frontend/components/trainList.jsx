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
          //filter  dates by filter
          .filter(
            (departure) =>
              filters.departures[
                departure.id.includes("Paris")
                  ? "PARIS (intramuros)"
                  : departure.id.toUpperCase()
              ]
          )
          //to remove undefined values
          .map((departure) => {
            return Object.keys(departure)
              .filter((key) =>
                key === "id" ||
                key === "exists" ||
                key === "hasPendingWrites" ||
                key === "__snapshot"
                  ? false
                  : true
              )
              .reduce((obj, key) => {
                obj[key] = departure[key];
                return obj;
              }, {});
          })

          //render element
          .map((departure, key) => {
            return (
              <div style={styles.container} key={key}>
                <Title style={styles.title} align="center">
                  {trains[key].id}
                </Title>
                <div
                  className={cssStyles.cards_container}
                  style={styles.cards_container}
                >
                  {Object.entries(departure)

                    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
                    .map(([departure, trips]) => (
                      <Train
                        key={departure}
                        destination={departure}
                        trips={Object.keys(trips)
                          .sort((a, b) =>
                            sortFrenchDates(
                              a.substring(0, 10),
                              b.substring(0, 10)
                            )
                          )
                          //filter by date
                          .filter((trip) => {
                            let found = false;
                            Object.entries(filters.dates).map(
                              ([filterTrip, enabled]) =>
                                enabled &&
                                moment(
                                  filterTrip.substring(13),
                                  "DD-MM-YYYY"
                                ).format("MM-DD-YYYY") >=
                                  moment(
                                    trip.substring(0, 10),
                                    "DD-MM-YYYY"
                                  ).format("MM-DD-YYYY") &&
                                moment(
                                  trip.substring(0, 10),
                                  "DD-MM-YYYY"
                                ).format("MM-DD-YYYY") >=
                                  moment(
                                    filterTrip.substring(0, 10),
                                    "DD-MM-YYYY"
                                  ).format("MM-DD-YYYY")
                                  ? (found = true)
                                  : null
                            );
                            return found;
                          })
                          .reduce((r, k) => ((r[k] = trips[k]), r), {})}
                      />
                    ))}
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
