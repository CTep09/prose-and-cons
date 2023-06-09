import React, { useContext, useState } from "react";
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
} from "@chakra-ui/react";
import { searchGoogleBooks } from "../utils/api";
import { useMutation } from "@apollo/client";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import SearchedBookCard from "./cards/SearchedBookCard";
import { ADD_BOOK } from "../utils/mutations";
import { UserContext } from "../contexts/UserContext";

const SearchBooksForm = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const { updateUserLibraryWithBook } = useContext(UserContext);

  const [addBook, { loading }] = useMutation(ADD_BOOK);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();
      const bookData = [];
      for (const book of items) {
        let isbn = "";
        let isbn13 = "";
        let industryIds = book.volumeInfo?.industryIdentifiers;
        industryIds.forEach((id) => {
          if (id.type == "ISBN_10") {
            isbn = id.identifier;
          }
          if (id.type == "ISBN_13") {
            isbn13 = id.identifier;
          }
        });
        // console.log(book.volumeInfo.authors);
        const bookObject = {
          bookId: book.id,
          authors: book.volumeInfo.authors || [],
          title: book.volumeInfo.title,
          description: book.volumeInfo.description,
          image: book.volumeInfo.imageLinks?.smallThumbnail || "",
          num_pages: book.volumeInfo.pageCount,
          date_pub: book.volumeInfo.publishedDate,
          isbn: isbn,
          isbn13: isbn13,
        };
        bookData.push(bookObject);
      }

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToLibrary = async (book) => {
    // console.log(book);
    const authorsArr = book.authors.map((author) => ({ displayName: author }));
    const payload = {
      title: book.title,
      authors: authorsArr,
      description: book.description,
      cover_img_url: book.image,
      num_pages: book.num_pages,
      date_pub: book.date_pub,
      isbn: book.isbn,
      isbn13: book.isbn13,
    };
    // console.log(payload);
    try {
      const { data } = await addBook({
        variables: {
          input: payload,
        },
      });
      console.log("book added!");
      updateUserLibraryWithBook(data.addBook);
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show an error message
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const navigate = useNavigate();

  const initialRef = React.useRef(null);

  return (
    <>
      <Flex direction="column" align="center" marginTop="5">
        <Button onClick={onOpen} colorScheme="green">
          Add Book <Icon as={AddIcon} boxSize={3} ml={4} />
        </Button>
      </Flex>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleFormSubmit}>
          <ModalContent>
            <ModalHeader>Find your next adventure</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={3}>
              <FormControl>
                <FormLabel>Search by ...</FormLabel>
                <InputGroup>
                  <Input
                    ref={initialRef}
                    placeholder="Book title"
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
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Search
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            <ModalBody pb={3}>
              <Flex direction="column" align="center" justify="center">
                {searchedBooks.map((book) => (
                  <div key={book.bookId}>
                    <SearchedBookCard
                      title={book.title}
                      author={book.authors.join(", ")}
                      img={book.image}
                      review={book.date_pub}
                    />
                    <Flex justify="center">
                      <Box mb={100}>
                        <Button
                          colorScheme="teal"
                          isLoading={loading}
                          onClick={() => handleAddToLibrary(book)}
                        >
                          Add to Library
                        </Button>
                      </Box>
                    </Flex>
                  </div>
                ))}
              </Flex>
            </ModalBody>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default SearchBooksForm;
