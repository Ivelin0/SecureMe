import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  Image,
} from "@nextui-org/react";
import { MailIcon } from "../../icons/MailIcon";
import { LockIcon } from "../../icons/LockIcon";
import { useState } from "react";
import { AuthComponent, SignUp } from "../../../models/auth.model";
import { useNavigate } from "react-router-dom";
import SecureMeLogo from "../../../assets/SecureMe.png";
import useSignUp from "./useSignUp";

const SignUpModal = ({ onClose, setSignIn }: AuthComponent) => {
  const { errorMessage, handleSubmit, changeData } = useSignUp();
  return (
    <>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Sign Up</ModalHeader>
        <ModalBody>
          <div className="flex">
            <div className="flex-1 flex flex-col justify-center items-center">
              <Image
                src={SecureMeLogo}
                alt="SecureMe logo"
                style={{ display: "block", height: "200px" }}
              />
              <p>
                Нямате приложението?
                <Link href="./secureme.apk" download>
                  Изтеглете го!
                </Link>
              </p>
            </div>
            <div className="flex-1">
              <Input
                autoFocus
                required
                classNames={{
                  label: "bg-transparent",
                }}
                onChange={(event) => {
                  changeData({ username: event.target.value });
                }}
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Потребителско име"
                placeholder="Въведи потребителско име"
                variant="underlined"
              />
              <Input
                autoFocus
                required
                classNames={{
                  label: "bg-transparent",
                }}
                onChange={(event) => {
                  changeData({ username: event.target.value });
                }}
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Имейл"
                placeholder="Въведи имейл"
                variant="underlined"
              />
              <Input
                required
                onChange={(event) => {
                  changeData({ password: event.target.value });
                }}
                classNames={{
                  label: "bg-transparent",
                }}
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Парола"
                placeholder="Въведи парола"
                type="password"
                variant="underlined"
              />
              <Input
                required
                onChange={(event) => {
                  changeData({ confirmPassword: event.target.value });
                }}
                classNames={{
                  label: "bg-transparent",
                }}
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Потвърди парола"
                placeholder="Потвърди своята парола"
                type="password"
                variant="underlined"
                errorMessage={errorMessage}
              />
              <div className="flex py-2 px-1 justify-between">
                <Checkbox
                  className="bg-transparent"
                  classNames={{
                    label: "text-small",
                  }}
                >
                  Запомни ме
                </Checkbox>
                <Link color="primary" href="#" size="sm">
                  Забравена парола?
                </Link>
              </div>
              <Link
                className="text-right"
                onClick={() => setSignIn((prev: boolean) => !prev)}
              >
                Имате акаунт?
              </Link>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={() => {
              onClose();
            }}
          >
            Затвори
          </Button>
          <Button type="submit" color="primary">
            Регистрирай се
          </Button>
        </ModalFooter>
      </form>
    </>
  );
};

export default SignUpModal;
