import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { MailIcon } from "../../MailIcon";
import { EyeFilledIcon } from "../../icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../icons/EyeSlashFilledIcon";
import { AuthComponent } from "../../../models/auth.model";
import useSignIn from "./useSignIn";

const SignUpModal = ({ onClose, setSignIn }: AuthComponent) => {
  const {
    errorMessage,
    isPasswordVisible,
    togglePasswordVisibility,
    handleSubmit,
    changeData,
  } = useSignIn();
  return (
    <>
      <form onSubmit={handleSubmit}>
        <ModalHeader className="flex flex-col gap-1">Sign In</ModalHeader>
        <ModalBody>
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
            errorMessage=""
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
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label="toggle password visibility"
              >
                {" "}
                {isPasswordVisible ? (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                ) : (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            label="Парола"
            placeholder="Въведи парола"
            type={isPasswordVisible ? "text" : "password"}
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
            Нямате акаунт?
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
            Затвори
          </Button>
          <Button type="submit" color="primary">
            Влез
          </Button>
        </ModalFooter>
      </form>
    </>
  );
};

export default SignUpModal;
