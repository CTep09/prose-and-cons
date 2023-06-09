import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

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

import { AddIcon, Search2Icon } from "@chakra-ui/icons";

import { QUERY_ME } from "../utils/queries";
import BookCard from "../components/BookCard";

import SearchBooksForm from "../components/SearchBooksForm";
import FriendCard from "../components/FriendCard";
import RecCard from "../components/RecCard";

const UserLibrary = () => {
  const { loading, data, error } = useQuery(QUERY_ME);

  useEffect(() => {
    if (!loading) {
      // At this point, loading is false, so the data is available.
      console.log(data);
    }
  }, [loading, data]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const initialRef = React.useRef(null);

  if (!Auth.loggedIn()) {
    navigate("/login");
    return null;
  }

  return (
    <main>
      <>
        <Flex direction="column" align="center">
          <Button onClick={onOpen}>
            Add Book
            <Icon as={AddIcon} boxSize={3} ml={4} />
          </Button>
        </Flex>
        <SearchBooksForm />
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
      <br />

      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>

        <Text fontSize="20px" align="center">
          Your Collection
        </Text>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            data?.me?.library?.map((book) => {
              return (
                <BookCard
                  key={book.book._id}
                  img={book.book.cover_img_url}
                  authors={book.book.author}
                  title={book.book.title}
                  review={book.rating?.ratingValue}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Friends Cards */}
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>

        <Text fontSize="20px" align="center">
          Your Friends
        </Text>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            data?.me?.friends?.map((friend) => {
              // return console.log(friend);
              return (
                <FriendCard
                  key={friend._id}
                  username={friend.username}
                  // authors={book.book.author}
                  // title={book.book.title}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>

        <Text fontSize="20px" align="center">
          Your Recommendations
        </Text>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            data.me.library.map((userBook) => {
              return (
                <RecCard
                  key={userBook._id}
                  user={userBook.book}
                  rating={userBook.rating}
                  review={userBook.review}
                  // title={book.book.title}
                  // review={book.rating?.ratingValue}
                />
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default UserLibrary;
