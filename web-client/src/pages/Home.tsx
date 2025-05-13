import { Button, useDisclosure } from "@nextui-org/react";
import SecureMe from "./SecureMe.svg";
import NavBar from "../components/NavBar";
import "../styles/main.css";
import DevicesLogo from "../assets/devices.png";
import Functionalities from "../components/Functionalities";
import SignInModal from "../components/authentication/AuthModal";

const Home = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <NavBar />
      <div
        className="topInfo items-center flex md:flex-row flex-col w-full justify-around"
        style={{ minHeight: "700px" }}
      >
        <div className="m-5 flex-col">
          <h1 style={{ color: "#f5f5f5" }}>Сигурност,</h1>
          <h1 style={{ color: "#f5f5f5" }}>която ви следва</h1>
          <h2 className="text-2xl font-bold" style={{ color: "#f5f5f5" }}>
            Приложение за защита на умни устройства
          </h2>
          <Button
            className="w-[70%] flex mt-5"
            color="primary"
            variant="shadow"
            size="lg"
            onPress={onOpen}
          >
            {"Защити се още сега!"}
          </Button>
        </div>

        <img className="self-center w-[50%] rounded-lg" src={DevicesLogo} />
      </div>
      <Functionalities />
      <SignInModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default Home;
