import Radium from "radium";
import React, { useContext, useState } from "react";
import { Title, Button, Text } from "@mantine/core";
import { BotContext, TrainsContext } from "context/context";
import Image from "next/image";
import Trips from "@components/trips";
import Filters from "./filters/filters";
import { isMobile } from "react-device-detect";
import cssStyles from "@components/responsive.module.css";
const TrainsHeader = () => {
  const [currentlyShown, setCurrentlyShown] = useState(null);
  const { dataBot } = useContext(BotContext);
  return (
    <>
      <div style={styles.container}>
        {!isMobile && <Filters />}
        <div style={styles.update}>
          <Title align="center" className={cssStyles.last_update} order={5}>
            Dèrniere mise a jour:
          </Title>
          <Text align="center" size={"sm"}>
            {dataBot && dataBot.lastUpdate}
          </Text>
        </div>
        <Button
          leftIcon={<Image src="/icons/robot.svg" width={25} height={25} />}
          size={!isMobile ? "md" : "xs"}
          onClick={() =>
            setCurrentlyShown((currentlyShown) =>
              currentlyShown === "bot" ? null : "bot"
            )
          }
        >
          {"Bot paramétres"}
        </Button>
      </div>
      {isMobile && (
        <>
          {currentlyShown && (
            <div style={styles.currentlyShown}>
              {currentlyShown === "bot" && <Trips />}
            </div>
          )}
          <div className={cssStyles.filers_container}>
            <Filters />
          </div>
        </>
      )}
      {!isMobile && currentlyShown && (
        <div style={styles.currentlyShown}>
          {currentlyShown === "bot" && <Trips />}
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    width: "calc(100vw - 30px)",
    display: "flex",
    padding: 30,
    justifyContent: "space-between",
  },
  title: {
    marginLeft: -40,
  },

  buttons: {
    display: "flex",
    gap: 30,
    backgroundColor: "#252525",
    padding: 10,
    borderRadius: 5,
  },
  update: {
    display: "flex",
    flexDirection: "column",
  },
  currentlyShown: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Radium(TrainsHeader);
