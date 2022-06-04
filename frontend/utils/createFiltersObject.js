import formatDate from "./formatDate";

const createObject = (data) => {
  if (!data) return;

  const filters = {
    destinations: { toutes: true, favoris: false },
    departures: {},
    dates: {},
  };
  data.departures.map((departure) => (filters.departures[departure] = true));
  data.trips.map(
    (trip) =>
      (filters.dates[formatDate(trip.maxDeparture, trip.maxReturn)] = true)
  );
  return filters;
};
export default createObject;
