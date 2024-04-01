import { FormEvent } from "react";
import "../styles/global.css";
import "../styles/register.css";
import logo from "./logo.png";
import { useForm } from "react-hook-form";
type FormInputs = {
  username: string;
  password: string;
};
export const Register = () => {
  const { register, getValues } = useForm<FormInputs>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: getValues("username"),
        password: getValues("password"),
      }),
    }).then((res) => res.json());
  };

  return (
    <div className="container">
      <div className="wrapper row">
        <div className="logo row">
          <img src={"./logo.svg"} />
          <h1>SecureMe</h1>
        </div>
        <div className="borderRight" />
        <div className="formWrapper">
          <form className="form" onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                {...register("username")}
                type="text"
                className="grow"
                placeholder="Username"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                {...register("password")}
                type="password"
                className="grow"
              />
            </label>
            <button className="btn">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};
