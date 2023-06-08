import React from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  ModalFooter,
  useDisclosure,
  Flex,
  Icon,
  Text,
  InputRightElement,
} from "@chakra-ui/react";

import {AddIcon, Search2Icon} from "@chakra-ui/icons";

import { QUERY_ME } from "../utils/queries";
import BookCard from "../components/BookCard";

import SearchBooksForm from "../components/SearchBooksForm"

const UserLibrary = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const library = data?.library || [];
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);

  return (
    <main>
      <>
      <Flex direction="column" align="center">
        <Button onClick={onOpen}>
          Add Book
          <Icon as={AddIcon} boxSize={3} ml={4} />
        </Button>
      </Flex>
      <SearchBooksForm/>
      {/* <Modal initialFocusRef={initialRef}  
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
          <ModalContent>
            <ModalHeader>Find your next adventure</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={3}>
              {/* <FormControl>
                <FormLabel>Search by ...</FormLabel>
                <InputGroup>
                <Input ref={initialRef} placeholder="Book title" />
                <InputRightElement>
                <Search2Icon />
                </InputRightElement>
                </InputGroup>
              </FormControl> */}
              {/* <SearchBooksForm ref={initialRef}/>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3}>
                Search
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent> */}
        {/* </Modal> */} 
      </>
      <br/>


      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>

        <Text fontSize='20px' align="center">Your Collection</Text>
        <div className="col-12 col-md-8 mb-3">
          {loading ? <div>Loading...</div> : <BookCard library={library} />}
        </div>
      </div>
    </main>
  );
};

export default UserLibrary;
