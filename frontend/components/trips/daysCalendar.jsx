import Radium from "radium";
import React, { useEffect, useState } from "react";
import { RangeCalendar } from "@mantine/dates";
import { Button } from "@mantine/core";
import moment from "moment";

const formatToDate = (date) => {
  if (!date) return null;
  return moment(date).format("YYYY-MM-DD");
};
function DaysCalendar({ tripDates, setTripDates }) {
  const [date, setDate] = useState([
    new Date(formatToDate(tripDates[1][0])),
    new Date(formatToDate(tripDates[1][1])),
  ]);
  const [fireStoreDates, setFireStoreDates] = useState([
    new Date(formatToDate(tripDates[1][0])),
    new Date(formatToDate(tripDates[1][1])),
  ]);

  const [changed, setChanged] = useState(false);
  useEffect(() => {
    if (changed && fireStoreDates[1]) {
      setTripDates([tripDates[0], [fireStoreDates[0], fireStoreDates[1]]]);
      setChanged(false);
    }
  }, [changed]);
  return (
    <RangeCalendar
      value={dates}
      onChange={(dates) => {
        setFireStoreDates([
          formatToDate(dates[0]) + "T00:00:00",
          formatToDate(dates[1]) + "T00:00:00",
        ]);
        setDates(dates);
        dates[1] && setChanged(true);
      }}
    />
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
  },
  saveButton: {
    margin: "10px",
  },
};

export default Radium(DaysCalendar);
