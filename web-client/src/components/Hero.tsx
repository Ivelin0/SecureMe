import { Button, Image, useDisclosure } from "@nextui-org/react";
import DevicesLogo from "../assets/devices.png";
import SignUpModal from "./SignInModal";
import SignInModal from "./AuthModal";
const Hero = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
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
            Защити се още сега!
          </Button>
        </div>

        <Image className="self-center" src={DevicesLogo} />
      </div>
      <SignInModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default Hero;
