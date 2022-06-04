import Radium from "radium";
import React, { useState } from "react";
import { Button, Text, Title, Card, Image } from "@mantine/core";
import * as moment from "node_modules/moment/moment";
import sortFrenchDates from "utils/sortFrenchDates";

const Dates = ({ tripDate, trips }) => {
  const [opened, setOpened] = useState(false);
  const styles = {
    title: { fontSize: 14, marginRight: 10, marginTop: 10 },
    title_container: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    trip: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    openMore: {
      transform: !opened ? "rotate(180deg)" : "rotate(0deg)",
      marginBottom: opened ? "0px" : "-20px",
    },
    trips: {
      display: "flex",
      width: "100%",
      justifyContent: "center",
    },
  };

  return (
    <div style={styles.trip}>
      <div
        style={styles.title_container}
        onClick={() => setOpened((opened) => !opened)}
      >
        <Title style={styles.title}>{tripDate} </Title>
        <Image
          src="/icons/openMore.svg"
          width={14}
          height={19}
          style={styles.openMore}
        />
      </div>
      {opened && (
        <div>
          <Title order={6}>
            {Object.keys(trips)
              .sort((a, b) =>
                sortFrenchDates(
                  /(\d+-\d+-\d+)/gm.exec(a)[0],
                  /(\d+-\d+-\d+)/gm.exec(b)[0]
                )
              )
              .map((dayOfTheWeek, key) => {
                return (
                  <div key={key}>
                    <Title align="center" order={6} style={{ marginTop: 10 }}>
                      {dayOfTheWeek}
                    </Title>
                    {trips[dayOfTheWeek].map((departure, key) => {
                      return (
                        <div style={styles.trips} key={key}>
                          <Text align="center" size="xs">
                            {departure.departureTime} - {departure.arrivalTime}{" "}
                            ({departure.seatsLeft} places)
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </Title>
        </div>
      )}
    </div>
  );
};

export default Radium(Dates);
