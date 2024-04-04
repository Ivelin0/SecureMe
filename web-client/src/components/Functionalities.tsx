import powerButtonLogo from "../assets/power-button-svgrepo-com.png";
import LocationLogo from "../assets/location_icon.png";
import incorrectPasswordLogo from "../assets/incorrect_password.png";
import { Image } from "@nextui-org/react";
import "../styles/functionalities.css";
const Functionalities = () => {
  return (
    <>
      <div className="text-center bg-gradient-to-r from-gray-200 to-cyan-200 p-10">
        <h1>Защо SecureMe?</h1>
        <div className="flex sm:flex-row flex-col sm:gap-2 gap-10 justify-around w-full">
          <div className="flex justify-center items-center flex-col w[200]">
            <Image src={powerButtonLogo} width={200} />
            <h1 className="font-bold text-4xl">Стартиране</h1>
            <h3 className="text-md text-center max-w-[400px]">
              При стартиране всяко устройство навързано към акаунта Ви ще бъде
              известено
            </h3>
          </div>
          <div className="flex items-center flex-col">
            <Image src={LocationLogo} width={200} className="sm:mt-20 mt-0" />
            <h1 className="font-bold text-4xl">Локация</h1>
            <h3 className="text-md text-center  max-w-[400px]">
              Ще може да следите локацията на всяко ваше устройство в реално
              време
            </h3>
          </div>
          <div className="flex justify-center items-center flex-col">
            <Image src={incorrectPasswordLogo} width={200} />
            <h1 className="font-bold text-4xl">Парола</h1>
            <h3 className="text-md text-center max-w-[400px]">
              При сгешена парола се прави снимка от предната камера на
              устройствата Ви, запазвайки я на сървъра и препращайки я към всяко
              навръзано устройство
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Functionalities;
