import moment from "moment";

const formatDate = (maxDeparture, maxReturn) => {
  return `${moment(maxDeparture).format("DD-MM-YYYY")} - 
    ${moment(maxReturn).format("DD-MM-YYYY")}`;
};
export default formatDate;
