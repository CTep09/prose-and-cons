import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
  SimpleGrid,
  Text,
  InputRightElement,
} from "@chakra-ui/react";

import { AddIcon, Search2Icon } from "@chakra-ui/icons";

import { QUERY_ME } from "../utils/queries";
import { ADD_RATING } from "../utils/mutations";
import BookCard from "../components/BookCard";

import SearchBooksForm from "../components/SearchBooksForm";
import FriendCard from "../components/FriendCard";

const UserLibrary = () => {
  const { loading, data, error } = useQuery(QUERY_ME);
  const [addRating, { loading: addRatingLoading }] = useMutation(ADD_RATING);

  const handleAddRating = async (ratingValue, bookId) => {
    console.log(ratingValue, bookId);
    try {
      await addRating({
        variables: { ratingValue: ratingValue, bookId: bookId },
        refetchQueries: [{ query: QUERY_ME }],
      });
      console.log("Rating added");
    } catch (err) {
      console.error(err);
    }
  };

  const authorsArr = [];

  useEffect(() => {
    if (!loading) {
      // At this point, loading is false, so the data is available.
      console.log(data);
    }
  }, [loading, data]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const initialRef = React.useRef(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  if (!Auth.loggedIn()) {
    navigate("/login");
    return null;
  }

  return (
    <main>
      <>
        {/* <Flex direction="column" align="center">
          <Button onClick={onOpen}>
            Add Book
            <Icon as={AddIcon} boxSize={3} ml={4} />
          </Button>
        </Flex> */}
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
        <SearchBooksForm />
      </>
      <br />

      <div>
        <div style={{ border: "1px solid #1a1a1a" }}></div>

        <Text fontSize="20px" align="center">
          Your Collection
        </Text>
        {/* <div className="col-12 col-md-8 mb-3"> */}
        <SimpleGrid minChildWidth="240px" spacing="40px">
          {data?.me?.library?.map((userBook) => {
            return (
              <BookCard
                key={userBook.book._id}
                bookId={userBook.book._id}
                img={userBook.book.cover_img_url}
                authors={authorsArr.join(", ")}
                title={userBook.book.title}
                ratingValue={userBook.rating?.ratingValue}
                readStatus={userBook.readStatus}
                addRating={handleAddRating}
              />
            );
          })}
        </SimpleGrid>
        {/* </div> */}
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
    </main>
  );
};

export default UserLibrary;
