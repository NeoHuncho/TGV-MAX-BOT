import Radium from "radium";
import React, { useContext, useState } from "react";
import { Title, Button, Text } from "@mantine/core";
import Image from "next/image";
import cssStyles from "./responsive.module.css";

import Trips from "./trips.jsx";
import { BotContext } from "context/context";
function TrainSettings() {
  const [showBotSettings, setShowBotSettings] = useState(false);
  const { data } = useContext(BotContext);

  const styles = {
    container: {
      borderBottom: showBotSettings ? "1px  solid #ccc" : null,
      marginBottom: "20px",
      padding: "10px",
    },
    options_container: {
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
    <>
      <div style={styles.container}>
        <div
          className={cssStyles.options_container}
          style={styles.options_container}
        >
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
      <Title align="center" order={5}>
        Dèrniere mise a jour:
      </Title>
      <Text align="center" size={"sm"}>
        {data && data.lastUpdate}
      </Text>
    </>
  );
}

export default Radium(TrainSettings);
