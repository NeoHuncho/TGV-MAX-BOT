import Radium from "radium";
import React, { useState } from "react";
import { Title } from "@mantine/core";
import Popper from "./popper";
import cssStyles from "@components/responsive.module.css";

const Filters = () => {
  const [showing, setShowing] = useState(null);
  return (
    <div className={cssStyles.filter_container} style={styles.container}>
      <div style={styles.buttons}>
        <Title
          onClick={() =>
            setShowing((showing) => (showing === "dates" ? null : "dates"))
          }
          order={5}
          style={styles.button}
        >
          dates
        </Title>

        <Title
          onClick={() =>
            setShowing((showing) =>
              showing === "departures" ? null : "departures"
            )
          }
          order={5}
          style={styles.button}
        >
          departs
        </Title>

        <Title
          onClick={() =>
            setShowing((showing) =>
              showing === "destinations" ? null : "destinations"
            )
          }
          order={5}
          style={styles.button}
        >
          destinations
        </Title>
      </div>
      <Popper showing={showing} />
    </div>
  );
};
const styles = {
  container: {
    backgroundColor: "#252525",
    padding: 10,
    borderRadius: 5,
  },
  buttons: {
    display: "flex",
    gap: 15,

    justifyContent: "space-between",
  },
  button: {
    cursor: "pointer",
  },
};

export default Radium(Filters);
