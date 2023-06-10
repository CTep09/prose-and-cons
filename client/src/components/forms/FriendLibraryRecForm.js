import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Icon,
  Box,
  Text,
} from "@chakra-ui/react";

import { useMutation, useQuery } from "@apollo/client";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import { MAKE_REC } from "../../utils/mutations";
import { QUERY_ME } from "../../utils/queries";

const FriendLibraryRecForm = ({ meData, otherUserData }) => {
  const myBooks = meData.library.map((userBook) => userBook.book);
  const yourBooks = otherUserData.library.map((userBook) => userBook.book);
  const yourBooksIds = yourBooks.map((book) => book._id);

  const filteredBooks = myBooks.filter(
    (book) => !yourBooksIds.includes(book._id)
  );
  const [results, setResults] = useState([...filteredBooks]);
  const [searchInput, setSearchInput] = useState("");
  const [makeRec, { loading: makeRecLoading }] = useMutation(MAKE_REC);

  useEffect(() => {
    if (searchInput.length > 0) {
      const searchFilteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().startsWith(searchInput.toLowerCase())
      );
      setResults([...searchFilteredBooks]); // Limit to top 10 results
    } else {
      setResults([...filteredBooks]); // Clear results when search input is empty
    }
  }, [filteredBooks, meData, myBooks, otherUserData.library, searchInput]);

  const handleMakeRec = async (friendId, bookId) => {
    await makeRec(friendId, bookId);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);

  return (
    <>
      <Flex direction="column" align="center">
        <Button onClick={onOpen}>
          Add Book
          <Icon as={AddIcon} boxSize={3} ml={4} />
        </Button>
      </Flex>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find your next adventure</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={3}>
            <form>
              <FormControl>
                <FormLabel>Search by ...</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Search by username"
                    name="searchInput"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    type="text"
                  />
                  <InputRightElement>
                    <Search2Icon />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FriendLibraryRecForm;
