import Radium from "radium";
import { Button, Text, Title } from "@mantine/core";
import { useDocument } from "swr-firestore-v9";
import { getAuth, signOut } from "firebase/auth";
import TrainSettings from "@components/trainSettings";
import TrainList from "@components/trainList";
function Trains() {

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        <TrainSettings />
        <TrainList />
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
