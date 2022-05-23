import Radium from "radium";
import React from "react";
import { Button, Text, Title, Card, Image } from "@mantine/core";
import Dates from "./sub-components/dates";
const Train = ({ destination, trips }) => {
  return (
    <div style={styles.card}>
      <Title align="center" order={3}>
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
    borderRadius: "10px",
    gap: "15px",
    padding: "15px",
    height: "fit-content",
    boxShadow: "0px 0px 5px #1864ab",
  },

  tripDates: { marginTop: "20px" },
  trip: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
};

export default Radium(Train);
