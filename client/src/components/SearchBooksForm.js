import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Flex, Icon, Text } from "@chakra-ui/react";
import { searchGoogleBooks } from "../utils/api";
import { useMutation } from "@apollo/client";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import BookCard from "./BookCard";

const SearchBooksForm = () => {
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
        image: book.volumeInfo.imageLinks?.smallThumbnail || "",
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
      <form onSubmit={handleFormSubmit}>
        <FormControl>
          <FormLabel>Search by ...</FormLabel>
          <InputGroup>
            <Input
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
          <Button type="submit">Search</Button>
        </FormControl>
      </form>
      <Flex>
        <div>
          {searchedBooks.map((book) => (
            <BookCard
              key={book.bookId}
              title={book.title}
              author={book.authors.join(", ")}
              img={book.image}
              review={book.date_pub}
            />
          ))}
        </div>
      </Flex>
    </>
  );
};

export default SearchBooksForm;