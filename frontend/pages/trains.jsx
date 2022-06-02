import Radium from "radium";
import { useState, createContext, useContext, useEffect } from "react";
import { Button, Text, Title } from "@mantine/core";
import { useDocument } from "swr-firestore-v9";
import { getAuth, signOut } from "firebase/auth";
import TrainSettings from "@components/trainSettings";
import TrainList from "@components/trainList";
import { BotContext } from "context/context";
import { useRouter } from "next/router";

function Trains() {
  const auth = getAuth();
  const router = useRouter();
  useEffect(() => {
    if (!auth.currentUser) router.push("/");
    else return;
  }, []);

  const { data, update } = useDocument("admin/botSettings", {
    listen: true,
    ignoreFirestoreDocumentSnapshotField: true,
  });
  if (auth.currentUser)
    return (
      <BotContext.Provider value={{ data, update }}>
        <div className={styles.container}>
          <div className={styles.options}>
            <TrainSettings />
            <TrainList />
          </div>
        </div>
      </BotContext.Provider>
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
