import moment from "node_modules/moment/moment";

const sortFrenchDates = (a, b) =>
  new Date(moment(a, "DD-MM-YYYY").format("YYYY-MM-DD")) -
  new Date(moment(b, "DD-MM-YYYY").format("YYYY-MM-DD"));
export default sortFrenchDates;
