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
  Spacer,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";

import { useMutation, useQuery } from "@apollo/client";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import { MAKE_REC, REMOVE_REC } from "../../utils/mutations";
import { QUERY_ME } from "../../utils/queries";
import MakeRecBtn from "../widgets/MakeRecBtn";

const FriendLibraryRecForm = ({ meData, otherUserData }) => {
  const myBooks = meData?.me.library.map((userBook) => userBook.book);
  const yourBooks = otherUserData?.user.library.map(
    (userBook) => userBook.book
  );
  const yourBooksIds = yourBooks.map((book) => book._id);

  const filteredBooks = myBooks.filter(
    (book) => !yourBooksIds.includes(book._id)
  );
  const [results, setResults] = useState([...filteredBooks]);
  const [searchInput, setSearchInput] = useState("");
  const [makeRec, { loading: makeRecLoading }] = useMutation(MAKE_REC);
  const [removeRec, { loading: removeRecLoading }] = useMutation(REMOVE_REC);

  useEffect(() => {
    if (searchInput.length > 0) {
      const searchFilteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().startsWith(searchInput.toLowerCase())
      );
      setResults([...searchFilteredBooks]); // Limit to top 10 results
    } else {
      setResults([...filteredBooks]); // Clear results when search input is empty
    }
  }, [searchInput]);

  const handleMakeRec = async (friendId, bookId) => {
    try {
      await makeRec({
        variables: { friendId: friendId, bookId: bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleRemoveRec = async (friendId, bookId) => {
    try {
      await removeRec({
        variables: { friendId: friendId, bookId: bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <Flex direction="column" align="center">
        <Button onClick={onOpen}>
          Recommend a Book <Icon as={AddIcon} boxSize={3} ml={4} />
        </Button>
      </Flex>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find your next adventure</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={3}>
            <form onSubmit={handleFormSubmit}>
              <FormControl>
                <FormLabel>Filter by Title</FormLabel>
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
            {results.map((book) => {
              return (
                <MakeRecBtn
                  key={book._id}
                  book={book}
                  friendId={otherUserData.user._id}
                  handleMakeRec={handleMakeRec}
                  handleRemoveRec={handleRemoveRec}
                />
                // <Box justify="center" padding={4} key={book._id}>
                //   <Flex>
                //     <Box width="240px">
                //       <h2>{book.title}</h2>
                //     </Box>
                //     <Spacer />
                //     <Button> Select </Button>
                //   </Flex>
                // </Box>
              );
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FriendLibraryRecForm;
