import { useState } from "react";

const useIncorrectPassowrd = ({ setImagePaths }) => {
  const displayDate = (value: string) => {
    const timestamp = value.slice(0, -4).split("-")[1];
    const date = new Date(parseInt(timestamp));
    const formattedDate = date.toLocaleDateString("bg-BG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedDate;
  };

  const retrieveImages = async (fcm_token: string) => {
    const response = await fetch(`http://localhost:8000/images/${fcm_token}`, {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());
    setImagePaths(response.images);
  };

  return { displayDate, retrieveImages };
};

export default useIncorrectPassowrd;
