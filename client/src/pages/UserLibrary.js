import React from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  Modal,
  Center,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  useDisclosure,
  Flex,
  Icon,
} from "@chakra-ui/react";

import {AddIcon} from "@chakra-ui/icons";

import { QUERY_ME } from "../utils/queries";
import BookCard from "../components/BookCard";

const UserLibrary = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const library = data?.library || [];
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  // const finalRef = React.useRef(null)

  return (
    <main>
      <>
      <Flex direction="column" align="center">
  <Button onClick={onOpen}>
    Add Book
    <Icon as={AddIcon} boxSize={3} ml={4} />
  </Button>
</Flex>
        {/* <Button ml={4} ref={finalRef}>
        I'll receive focus on close
      </Button> */}

        <Modal
          initialFocusRef={initialRef}
          // finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Find your next adventure</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Enter a title</FormLabel>
                <Input ref={initialRef} placeholder="Book title" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3}>
                Search
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
