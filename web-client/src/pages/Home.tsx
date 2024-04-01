import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import SecureMe from "./SecureMe.svg";
import NavBar from "../components/NavBar";
import "../styles/main.css";
import DevicesLogo from "../assets/devices.png";
import Functionalities from "../components/Functionalities";
import SignInModal from "../components/AuthModal";

const Home = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <NavBar />
      <div className="topInfo items-center flex md:flex-row flex-col w-full justify-around gap-5">
        <div className="">
          <h1>Сигурност,</h1>
          <h1>която ви следва</h1>
          <h2 className="text-2xl font-bold">
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

        <Image className="self-center" src={DevicesLogo} />
      </div>
      <Functionalities />
      <SignInModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default Home;
