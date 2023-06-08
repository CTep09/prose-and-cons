import React, { useState } from "react";
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
import { searchGoogleBooks } from "../utils/api";
import { useMutation } from "@apollo/client";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";

const SearchBooksForm = ({ initialRef }) => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

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

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || [],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
        isbn: book.volumeInfo.industryIdentifiers[0].indentifier,
        isbn13: book.volumeInfo.industryIdentifiers[1].indentifier,
        num_pages: book.volumeInfo.pageCount,
        date_pub: book.volumeInfo.publishedDate,
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <FormControl onSubmit={handleFormSubmit}>
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
      <Flex>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <div>
          {searchedBooks.map((book) => {
            return (
              <div key={book.bookId}>
                <p>{book.title}</p>
              </div>
            );
          })}
        </div>
      </Flex>
    </>
  );
};
