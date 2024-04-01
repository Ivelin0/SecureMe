import { Button, Image, useDisclosure } from "@nextui-org/react";
import SecureMe from "./SecureMe.svg";
import NavBar from "../components/NavBar";
import "../styles/main.css";
import DevicesLogo from "../assets/devices.png";
import Functionalities from "../components/Functionalities";
import SignInModal from "../components/AuthModal";
import Hero from "../components/Hero";

const Home = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <NavBar />
      <Hero />
      <Functionalities />
      <SignInModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default Home;
