import React from "react";
import { useQuery } from "@apollo/client";
import {Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, useDisclosure } from "@chakra-ui/react";

import { QUERY_ME } from "../utils/queries";
import BookCard from "../components/BookCard";

const UserLibrary = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const library = data?.library || [];
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)


  return (
    <main>
        <>
      <Button onClick={onOpen}>Open Modal</Button>
      <Button ml={4} ref={finalRef}>
        I'll receive focus on close
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>First name</FormLabel>
              <Input ref={initialRef} placeholder='First name' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last name</FormLabel>
              <Input placeholder='Last name' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? <div>Loading...</div> : <BookCard library={library} />}
        </div>
      </div>
    </main>
  );
};

export default UserLibrary;

