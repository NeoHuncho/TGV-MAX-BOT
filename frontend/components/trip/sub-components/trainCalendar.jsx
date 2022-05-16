import Radium from "radium";
import React, { useEffect, useState } from "react";
import { RangeCalendar } from "@mantine/dates";
import { Button } from "@mantine/core";
import moment from "moment";

const formatToDate = (date) => {
  if (!date) return null;
  return moment(date).format("YYYY-MM-DD");
};
function TrainCalendar({
  tripDates,
  setTripDates,
  setDepartureDates,
  setReturnDates,
}) {
  const [dates, setDates] = useState(
    tripDates[1] && [
      new Date(formatToDate(tripDates[1][0])),
      new Date(formatToDate(tripDates[1][1])),
    ]
  );
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setDates(
      tripDates[1] && [
        new Date(formatToDate(tripDates[1][0])),
        new Date(formatToDate(tripDates[1][1])),
      ]
    );
  }, [tripDates]);

  useEffect(() => {
    if (changed && dates[1]) {
      setTripDates([
        tripDates[0],
        [
          formatToDate(dates[0]) + "T00:00:00",
          formatToDate(dates[1]) + "T00:00:00",
        ],
      ]);
      setDepartureDates((departureDates) => {
        return [
          departureDates[0],
          [
            formatToDate(dates[0]) + "T00:00:00",
            departureDates[1] &&
              departureDates[1]
                .filter(
                  (date) =>
                    formatToDate(dates[1]) + "T00:00:00" >=
                    date >=
                    formatToDate(dates[0]) + "T00:00:00"
                )
                .filter((array) => array.length > 0),
          ],
        ];
      });
      setReturnDates((returnDates) => [
        returnDates[0],
        [
          formatToDate(dates[1]) + "T00:00:00",
          returnDates[1] &&
            returnDates[1]
              .filter(
                (date) =>
                  formatToDate(dates[1]) + "T00:00:00" >=
                  date >=
                  formatToDate(dates[0]) + "T00:00:00"
              )
              .filter((array) => array.length > 0),
        ],
      ]);
      setChanged(false);
    }
  }, [changed]);

  return (
    <RangeCalendar
      value={dates}
      onChange={(dates) => {
        setDates([
          new Date(formatToDate(dates[0])),
          new Date(formatToDate(dates[1])),
        ]);
        dates[1] && setChanged(true);
      }}
      minDate={new Date(moment())}
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
