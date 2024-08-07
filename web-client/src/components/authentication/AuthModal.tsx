import { Modal, ModalContent } from "@nextui-org/react";
import { useState } from "react";
import SignInModal from "./SignIn/SignInModal";
import SignUpModal from "./SignUp/SignUpModal";
const AuthModal = ({ isOpen, onOpenChange }: any) => {
  const [isSignIn, setSignIn] = useState<boolean>(true);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {isSignIn ? (
                <SignInModal onClose={onClose} setSignIn={setSignIn} />
              ) : (
                <SignUpModal onClose={onClose} setSignIn={setSignIn} />
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
