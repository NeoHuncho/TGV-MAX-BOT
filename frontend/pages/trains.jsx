import Radium from "radium";
import { useState, createContext, useContext, useEffect } from "react";

import { useDocument, useCollection } from "swr-firestore-v9";
import { getAuth, signOut } from "firebase/auth";

import TrainList from "@components/trainList";
import { BotContext, FiltersContext, TrainsContext } from "context/context";
import { useRouter } from "next/router";
import createFiltersObject from "@utils/createFiltersObject.js";
function Trains() {
  const auth = getAuth();
  const router = useRouter();
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) router.push("/");
    else return;
  }, []);

  const { data: dataBot, update: updateBot } = useDocument(
    "admin/botSettings",
    {
      listen: true,
      ignoreFirestoreDocumentSnapshotField: true,
    }
  );
  const { data: dataTrains, update: updateTrains } = useCollection(`trains`, {
    listen: true,
    ignoreFirestoreDocumentSnapshotField: true,
  });
  useEffect(() => {
    if (dataBot) setFilters(createFiltersObject(dataBot));
  }, [dataBot]);

  if (auth.currentUser)
    return (
      <BotContext.Provider value={{ dataBot, updateBot }}>
        <TrainsContext.Provider value={{ dataTrains, updateTrains }}>
          <FiltersContext.Provider value={{ filters, setFilters }}>
            <div className={styles.container}>
              <div className={styles.options}>
                <TrainList />
              </div>
            </div>
          </FiltersContext.Provider>
        </TrainsContext.Provider>
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
