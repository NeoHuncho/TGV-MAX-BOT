import Radium from "radium";
import React, { useState } from "react";
import { Button, Text, Title, Card, Image } from "@mantine/core";
import * as moment from "node_modules/moment/moment";

const Dates = ({ tripDate, trips }) => {
  const [opened, setOpened] = useState(false);
  const styles = {
    tripDates: {},
    trip: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    openMore: {
      transform: !opened ? "rotate(180deg)" : "rotate(0deg)",
      marginTop: opened ? "-8px" : "0px",
    },
    trips: {
      display: "flex",
    },
  };

  return (
    <div style={styles.trip}>
      <Title order={5}>{tripDate} </Title>
      <Image
        onClick={() => setOpened((opened) => !opened)}
        src="/icons/openMore.svg"
        width={14}
        height={19}
        style={styles.openMore}
      />
      {opened && (
        <div>
          <Title order={6}>
            {Object.keys(trips).map((dayOfTheWeek, key) => {
              return (
                <div key={key}>
                  <Title align="center" order={6}>
                    {dayOfTheWeek}
                  </Title>
                  {trips[dayOfTheWeek].map((departure, key) => {
                    console.log(departure);
                    return (
                      <div style={styles.trips} key={key}>
                        <Text size="xs">
                          {departure.departureTime} - {departure.arrivalTime} (
                          {departure.seatsLeft} places)
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
