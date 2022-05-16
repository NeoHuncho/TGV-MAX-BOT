import Radium from "radium";
import React, { useState } from "react";
import { Title, Button, Text } from "@mantine/core";
import Image from "next/image";

import Trips from "./trips.jsx";
function TrainSettings() {
  const [showBotSettings, setShowBotSettings] = useState(false);

  const styles = {
    container: {
      borderBottom: showBotSettings ? "1px  solid #ccc" : null,
      marginBottom: "20px",
      padding: "10px",
    },
    optionsContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: showBotSettings ? "center" : null,
      padding: "20px",
      marginBottom: "20px",
      alignItems: "center",
      gap: "10vw",
    },

    optionHeader: {
      textAlign: "center",
      marginBottom: "20px",
    },

    showcase: {
      display: "flex",
      justifyContent: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.optionsContainer}>
        <Button
          leftIcon={<Image src="/icons/robot.svg" width={25} height={25} />}
          size="md"
          onClick={() => setShowBotSettings((botSettings) => !botSettings)}
        >
          {!showBotSettings ? "Bot paramétres" : "Fermer bot paramétres"}
        </Button>
        {showBotSettings && (
          <div>
            <Trips />
          </div>
        )}
      </div>
    </div>
  );
}

export default Radium(TrainSettings);
