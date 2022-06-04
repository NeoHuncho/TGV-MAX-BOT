import { BotContext, FiltersContext, TrainsContext } from "context/context";
import Radium from "radium";
import React, { useContext } from "react";
import { Checkbox } from "@mantine/core";
import { filter } from "lodash";
const PopperComponent = ({ showing }) => {
  const { dataBot: data } = useContext(BotContext);
  const { filters, setFilters } = useContext(FiltersContext);
  if (!showing) return;
  if (!data || !filters) return null;

  const updateFilter = (type, label, value) => {
    console.log(type, label);
    setFilters({ ...filters, [type]: { ...filters[type], [label]: !value } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.checkboxContainer}>
        {showing === "departures" &&
          Object.entries(filters.departures).map(([key, value], index) => (
            <Checkbox
              key={index}
              label={key}
              checked={value}
              onChange={() => updateFilter("departures", key, value)}
            />
          ))}
        {showing === "destinations" &&
          Object.entries(filters.destinations).map(([key, value], index) => (
            <Checkbox
              key={index}
              label={key}
              checked={value}
              onChange={() => updateFilter("destinations", key, value)}
            />
          ))}
        {showing === "dates" &&
          Object.entries(filters.dates).map(([key, value], index) => (
            <Checkbox
              key={index}
              label={key}
              checked={value}
              onChange={() => updateFilter("dates", key, value)}
            />
          ))}
      </div>
    </div>
  );
};
const styles = {
  checkboxContainer: {
    width: "fit-content",
    gap: 10,
    display: "flex",
    flexDirection: "column",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
};

export default Radium(PopperComponent);
