import { useEffect, useState } from "react";
import moment from "moment";

import { ACCORDION_TYPES } from "../models/accordion.model";

import { DateRangePicker } from "react-dates";

import useLocationHistory from "./useLocationHistory";

const LocationHistory = ({
  currFcm,
  accordionType,
  locationPoints,
  setLocationPoints,
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, "days"));
  const [endDate, setEndDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState(null);

  const { handleDateChange, getLocationHistory } = useLocationHistory({
    currFcm,
    locationPoints,
    setLocationPoints,
  });

  useEffect(() => {
    if (accordionType != ACCORDION_TYPES.Location) return;

    getLocationHistory({ startDate, endDate });
  }, [accordionType]);

  return (
    <>
      <DateRangePicker
        startDate={startDate} 
        startDateId="unique_start_date_id" 
        endDate={endDate}
        endDateId="unique_end_date_id"
        isOutsideRange={() => false}
        onDatesChange={({ startDate, endDate }) => {
          console.log("reset");
          setStartDate(startDate);
          setEndDate(endDate);
          handleDateChange({ startDate, endDate });
        }} 
        focusedInput={focusedInput} 
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)} 
        style={{ overflow: "unset !important" }}
      />
    </>
  );
};

export default LocationHistory;
