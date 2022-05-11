import { useState } from "react";
import moment from "moment";
import Radium from "radium";

import { getAuth, signOut } from "firebase/auth";
import TrainSettings from "@components/trainSettings";
function Trains() {
  const [dates, setDates] = useState([]);
  return (
    <div className={styles.container}>
      <div className={styles.options}>
        <TrainSettings />
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
  },
  options: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    width: "100%",
    gridGap: "20px",
    paddingTop: "20px",
  },
};

export default Radium(Trains);
