import { Image, Accordion, AccordionItem } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import displayDate from "../utility";
const IncorrectPassword = ({ imagePaths, currFcm }: any) => {
  const [index, setIndex] = useState<number>(0);
  console.log("imagePaths", imagePaths);

  useEffect(() => {
    setIndex(0);
  }, [currFcm]);

  return (
    <div style={{ position: "relative" }}>
      {imagePaths?.length ? (
        <>
          <h3 className="text-center" style={{ color: "grey" }}>
            Снимка при сгрешена парола
          </h3>
          <div style={{ display: "relative", flexDirection: "row" }}>
            {index > 0 ? (
              <button
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translate(0, -50%)",
                  fontSize: "60px",
                  color: "white",
                  border: "2px solid white",
                  left: 0,
                }}
                onClick={() => setIndex((prev) => prev - 1)}
              >
                {"<"}
              </button>
            ) : (
              <></>
            )}

            <img
              src={`http://192.168.1.2:8000/images/${currFcm}/${imagePaths[index]}`}
              onClick={() => {
                window.open(
                  `http://192.168.1.2:8000/images/${currFcm}/${imagePaths[index]}`,
                  "_blank"
                );
              }}
              style={{ zIndex: 0 }}
            />

            {index < imagePaths.length - 1 ? (
              <button
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translate(0, -50%)",
                  fontSize: "60px",
                  right: 0,
                  color: "white",
                  border: "2px solid white",
                  padding: "2%",
                }}
                onClick={() => setIndex((prev) => prev + 1)}
              >
                {">"}
              </button>
            ) : (
              <h1></h1>
            )}
          </div>

          <p className="text-center">
            Дата на снимане: {displayDate(imagePaths[index])}
          </p>
        </>
      ) : (
        <p>Няма данни за сгрешени пароли вмомента</p>
      )}
    </div>
  );
};

export default IncorrectPassword;
