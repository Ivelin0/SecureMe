import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { MailIcon } from "./MailIcon";
import { LockIcon } from "./LockIcon";
import { useState } from "react";
import { SignIn } from "../models/auth.model";
import { AuthComponent, SignUp } from "../models/auth.model";
import { useNavigate } from "react-router-dom";

const SignUpModal = ({ onClose, setSignIn }: AuthComponent) => {
  const navigate = useNavigate();

  const [data, setData] = useState<SignUp>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { password, confirmPassword } = data;
    if (password != confirmPassword) {
    }
    const response = await fetch(`${process.env.REACT_APP_HTTP_PROXY_SERVER}/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    navigate("/admin_panel");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <ModalHeader className="flex flex-col gap-1">Sign Up</ModalHeader>
        <ModalBody>
          <Input
            autoFocus
            required
            classNames={{
              label: "bg-transparent",
            }}
            onChange={(event) => {
              setData({ ...data, username: event.target.value });
            }}
            endContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            label="Username"
            placeholder="Enter your email"
            variant="underlined"
          />
          <Input
            required
            onChange={(event) => {
              setData({ ...data, password: event.target.value });
            }}
            classNames={{
              label: "bg-transparent",
            }}
            endContent={
              <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            label="Password"
            placeholder="Enter your password"
            type="password"
            variant="underlined"
          />
          <Input
            required
            onChange={(event) => {
              setData({ ...data, password: event.target.value });
            }}
            classNames={{
              label: "bg-transparent",
            }}
            endContent={
              <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            label="Confirm Passowrd"
            placeholder="Enter your password"
            type="password"
            variant="underlined"
          />
          <div className="flex py-2 px-1 justify-between">
            <Checkbox
              className="bg-transparent"
              classNames={{
                label: "text-small",
              }}
            >
              Remember me
            </Checkbox>
            <Link color="primary" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Link
            className="text-right"
            onClick={() => setSignIn((prev: boolean) => !prev)}
          >
            Имате акаунт?
          </Link>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={() => {
              onClose();
            }}
          >
            Close
          </Button>
          <Button type="submit" color="primary">
            Sign Up
          </Button>
        </ModalFooter>
      </form>
    </>
  );
};

export default SignUpModal;
