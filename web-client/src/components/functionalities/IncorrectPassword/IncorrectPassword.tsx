import { Image, Accordion, AccordionItem } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";

const IncorrectPassword = ({ imagePaths, currFcm }: any) => {
  const [index, setIndex] = useState<number>(0);
  console.log("imagePaths", imagePaths);

  const displayDate = (value: string) => {
    const timestamp = value.slice(0, -4).split("-")[1];
    console.log("timestamp", timestamp);
    const date = new Date(parseInt(timestamp));
    const formattedDate = date.toLocaleDateString("bg-BG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedDate;
  };
  return (
    <>
      {imagePaths?.length ? (
        <>
          <h3 className="text-center">Снимка при сгрешена парола</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {index > 0 ? (
              <button
                style={{
                  border: "2px solid black",
                  borderRadius: "20px",
                  width: "40px",
                  height: "40px",
                }}
                onClick={() => setIndex((prev) => prev - 1)}
              >
                {"<"}
              </button>
            ) : (
              <></>
            )}

            <Image
              width={300}
              alt="NextUI hero Image"
              src={`http://localhost:8000/images/${currFcm}/${imagePaths[index]}`}
              onClick={() => {
                window.open(
                  `http://localhost:8000/images/${currFcm}/${imagePaths[index]}`,
                  "_blank"
                );
              }}
            />

            {index < imagePaths.length - 1 ? (
              <button
                style={{
                  border: "2px solid black",
                  borderRadius: "20px",
                  width: "40px",
                  height: "40px",
                }}
                onClick={() => setIndex((prev) => prev + 1)}
              >
                {">"}
              </button>
            ) : (
              <h1></h1>
            )}
          </div>{" "}
          <p className="text-center">
            Дата на снимане: {displayDate(imagePaths[index])}
          </p>
        </>
      ) : (
        <p>Няма данни за сгрешени пароли вмомента</p>
      )}
    </>
  );
};

export default IncorrectPassword;
