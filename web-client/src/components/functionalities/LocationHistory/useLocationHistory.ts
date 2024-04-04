const useLocationHistory = ({ currFcm, locationPoints, setLocationPoints }) => {

  const handleDateChange = async ({ startDate, endDate }) => {
    if (!endDate) return;
    getLocationHistory({ startDate, endDate });
  };

  const getLocationHistory = async ({ startDate, endDate }) => {
    if (!endDate) return;

    const response = await fetch(
      `${process.env.REACT_APP_HTTP_PROXY_SERVER}/location_history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.valueOf(),
          endDate: endDate.valueOf(),
          fcm: currFcm,
        }),
        credentials: "include",
      }
    ).then((res) => res.json());

    setLocationPoints(response.locations);
  };

  return { locationPoints, handleDateChange, getLocationHistory };
};

export default useLocationHistory;
