import { useState } from "react";
import { SignIn, SignUp } from "../../../models/auth.model";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";

const useSignIn = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<SignIn>({
    username: "",
    password: "",
  });

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);

  const changeData = (
    authData: { username: string } | { password: string }
  ) => {
    setData({ ...data, ...authData });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await fetch(
      `${process.env.REACT_APP_HTTP_PROXY_SERVER}/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status != StatusCodes.OK)
      setErrorMessage((await response.json()).message);
    else navigate("/admin_panel");
  };

  return {
    errorMessage,
    isPasswordVisible,
    togglePasswordVisibility,
    handleSubmit,
    changeData,
  };
};

export default useSignIn;
