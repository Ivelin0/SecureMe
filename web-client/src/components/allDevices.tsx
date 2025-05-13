import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import mobileIcon from "../assets/mobiles.png";
const AllDevices = () => {
  const [deviceNames, setDeviceNames] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const devices = await fetch(
        `${process.env.REACT_APP_HTTP_PROXY_SERVER}/devices`,
        {
          method: "GET",
          credentials: "include",
        }
      ).then((res) => res.json());

      setDeviceNames(devices.message);
    };

    fetchData();
  }, []);

  return (
    <div className="flex !block justify-center">
      {(deviceNames ?? []).map((device) => {
        return (
          <Card className=" m-4">
            <CardBody>
              <div className="flex flex-inline justify-evenly">
                <p className="self-center text-3xl font-bold">{device}</p>
                <img className="w-20" src={mobileIcon} />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default AllDevices;
