import React, { useEffect, useState } from "react";
import { Button, Text, Title, Card } from "@mantine/core";
import { useCollection } from "swr-firestore-v9";
const TrainList = () => {
  const { data, update } = useCollection(`trains`, {
    listen: true,
    ignoreFirestoreDocumentSnapshotField: true,
  });
  const [trains, setTrains] = useState(null);
  useEffect(() => {
    if (data) setTrains(data);
  }, [data]);

  return (
    <div>
      {trains &&
        Object.values(trains).map((destination) => {
          <Card     />;
        })}
    </div>
  );
};

export default TrainList;
