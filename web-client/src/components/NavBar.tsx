import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Image,
} from "@nextui-org/react";
import SecureMeLogo from "../assets/SecureMe.png";

export default function App() {
  return (
    <Navbar isBordered>
      <NavbarContent justify="start" />
      <NavbarContent justify="center">
        <NavbarItem className="flex flex-row gap-2 justify-center items-center">
          <Image src={SecureMeLogo} className="w-12" alt="SecureMe logo" />
          <p className="font-bold text-4xl text-[#595959]">SecureMe</p>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" />
    </Navbar>
  );
}
