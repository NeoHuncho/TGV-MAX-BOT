import Radium from "radium";
import React from "react";
import { Button, Text, Title, Card, Image } from "@mantine/core";
import Dates from "./sub-components/dates";
const Train = ({ destination, trips }) => {
  return (
    <div style={styles.card}>
      <Title style={styles.title} align="center" order={3}>
        {destination}
      </Title>
      <div styles={styles.tripDates}>
        {Object.entries(trips).map(([trip, trips]) => {
          return <Dates key={trip} tripDate={trip} trips={trips} />;
        })}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#1864ab",
    borderRadius: "5px",
    gap: "15px",
    padding: "15px",
    minHeight: "160px",
    height: "fit-content",
    boxShadow:
      " rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;",
  },

  tripDates: { marginTop: "20px" },
  trip: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
};

export default Radium(Train);
