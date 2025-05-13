import { useState, useEffect } from "react";
import displayDate from "../utility";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

const BootHistory = ({ accordionType, currFcm }) => {
  const [bootHistory, setBootHistory] = useState<Array<{ timestamp: number }>>(
    []
  );

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_HTTP_PROXY_SERVER}/boot/` + currFcm,
        {
          method: "GET",
        }
      ).then((res) => res.json());
      console.log(res);
      setBootHistory(res.message);
    };

    getData();
  }, [accordionType]);
  return (
    <>
      {bootHistory?.length === 0 ? (
        <>Няма история за включвания</>
      ) : (
        <Card>
          {bootHistory?.map((boot) => {
            const formattedDate = new Date(boot?.timestamp).toLocaleDateString(
              "bg-BG",
              {
                minute: "numeric",
                hour: "2-digit",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            );
            console.log(boot.timestamp);
            return <CardBody className="text-center">{formattedDate}</CardBody>;
          })}
        </Card>
      )}
    </>
  );
};

export default BootHistory;
