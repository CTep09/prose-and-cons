import React, { useState } from "react";
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
  Text,
} from "@chakra-ui/react";
import { searchGoogleBooks } from "../utils/api";
import { useMutation } from "@apollo/client";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import BookCard from "./BookCard";
import { ADD_BOOK, SAVE_BOOK } from "../utils/mutations";

const SearchBooksForm = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
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
      // authors: [
      //   {
      //     firstName: book.authors[0].firstName,
      //   },
      // ],
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
      await addBook({
        variables: {
          input: payload,
        },
      });
      console.log("book added!");
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
    <Flex direction="column" align="center">
      <Button onClick={onOpen}>
        Add Book
        <Icon as={AddIcon} boxSize={3} ml={4} />
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
                <Input ref={initialRef}
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
              <ModalFooter>
              <Button type="submit">Search</Button>
              <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
    <Flex>
      <div>
        {searchedBooks.map((book) => (
          <div key={book.bookId}>
            <BookCard
              title={book.title}
              author={book.authors.join(", ")}
              img={book.image}
              review={book.date_pub}
            />
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={loading}
              onClick={() => handleAddToLibrary(book)}
            >
              Add to Library
            </Button>
          </div>
        ))}
      </div>
    </Flex>
  </>
  );
};

export default SearchBooksForm;
