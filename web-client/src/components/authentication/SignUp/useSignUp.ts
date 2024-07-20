import { useNavigate } from "react-router-dom";
import { SignUp } from "../../../models/auth.model";
import { useState } from "react";

enum ErrorMessage {
  Password_Not_Match = 0,
  Password_Not_Long_Enough = 1,
}

type ErrorMessageType =
  | ErrorMessage.Password_Not_Match
  | ErrorMessage.Password_Not_Long_Enough;

const ErrorMessages = {
  [ErrorMessage.Password_Not_Long_Enough]:
    "Паролата трябва да има поне 5 символа",
  [ErrorMessage.Password_Not_Match]: "Паролите не са единтични!",
};

const useSignUp = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<SignUp>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const changeData = (
    newData:
      | { username: string }
      | { password: string }
      | { confirmPassword: string }
  ) => {
    setData({ ...data, ...newData });
  };

  const [errorMessage, setErrorMessage] = useState("");

  const showError = (errorType: ErrorMessageType) => {
    setErrorMessage(ErrorMessages[errorType]);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { password, confirmPassword } = data;
    if (password != confirmPassword) {
      showError(ErrorMessage.Password_Not_Match);
      return;
    }

    if (password.length < 5) {
      showError(ErrorMessage.Password_Not_Long_Enough);
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_HTTP_PROXY_SERVER}/register`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((res) => res.json());

    navigate("/admin_panel");
  };

  return {
    errorMessage,
    handleSubmit,
    changeData,
  };
};

export default useSignUp;
