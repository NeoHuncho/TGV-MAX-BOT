import Radium from "radium";
import React, { useEffect, useState } from "react";
import { Calendar } from "@mantine/dates";
import { Button } from "@mantine/core";
import moment from "moment";

const formatToDate = (date) => {
  if (!date) return null;
  return moment(date).format("YYYY-MM-DD");
};
function TrainCalendar({
  departureDates,
  setDepartureDates,
  returnDates,
  setReturnDates,
  minmax,
}) {
  const tripDays = setDepartureDates ? departureDates : returnDates;
  const setTripDays = setDepartureDates ? setDepartureDates : setReturnDates;

  const [dates, setDates] = useState(
    tripDays[1].map((trip) => new Date(formatToDate(trip)))
  );
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    setDates(tripDays[1].map((trip) => new Date(formatToDate(trip))));
  }, [tripDays]);

  useEffect(() => {
    if (changed && dates[1]) {
      setTripDays([
        true,
        dates.map((date) => formatToDate(date) + "T00:00:00"),
      ]);
      setChanged(false);
    }
  }, [changed]);

  return (
    <Calendar
      multiple
      value={dates}
      onChange={(dates) => {
        setDates(dates);
        setChanged(true);
      }}
      minDate={new Date(formatToDate(minmax[0]))}
      maxDate={new Date(formatToDate(minmax[1]))}
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

export default Radium(TrainCalendar);
