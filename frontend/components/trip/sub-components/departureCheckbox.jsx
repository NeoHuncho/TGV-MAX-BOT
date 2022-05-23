import Radium from "radium";
import React from "react";
import { useDocument } from "swr-firestore-v9";
import { Checkbox } from "@mantine/core";
const departureCheckbox = ({ departures, setDepartures }) => {
  return (
    <div style={styles.container}>
      {Object.entries(departures[1]).map(([key, value]) => (
        <Checkbox
          style={styles.checkbox}
          label={key}
          key={key}
          checked={value.enabled}
          onChange={(event) =>
            setDepartures((departures) => [
              departures[0],
              { ...departures[1], [key]: { enabled: event.target.checked } },
            ])
          }
        />
      ))}
    </div>
  );
};

const styles = {
  checkbox: {
    marginBottom: "10px",
  },
};

export default Radium(departureCheckbox);
