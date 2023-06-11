/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  Center,
} from "@chakra-ui/react";

import { QUERY_ME } from "../utils/queries";
import { ADD_RATING, CHANGE_READSTATUS } from "../utils/mutations";
import BookCard from "../components/cards/BookCard";

import SearchBooksForm from "../components/SearchBooksForm";

const UserLibrary = () => {
  const [sortOrder, setSortOrder] = useState("title");

  const { loading, data, error } = useQuery(QUERY_ME);

  const [addRating, { loading: addRatingLoading }] = useMutation(ADD_RATING);
  const [changeReadStatus, { loading: changeReadStatusLoading }] =
    useMutation(CHANGE_READSTATUS);

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

  const handleChangeReadStatus = async (readStatus, bookId) => {
    console.log(readStatus, bookId);
    try {
      await changeReadStatus({
        variables: { readStatus: readStatus, bookId: bookId },
        refetchQueries: [{ query: QUERY_ME }],
      });
      console.log("Read Status changed");
    } catch (err) {
      console.error(err);
    }
  };

  // Helper functions
  const sortBooks = (books) => {
    return [...books].sort((a, b) => {
      if (sortOrder === "title") {
        return a.book.title.localeCompare(b.book.title);
      } else if (sortOrder === "author") {
        // Assuming authors is an array and we're sorting by the first author
        return a.book.authors[0].sortName.localeCompare(
          b.book.authors[0].sortName
        );
      } else if (sortOrder === "rating") {
        // Use 0 as a default rating for books without a rating
        const ratingA = a.rating?.ratingValue || 0;
        const ratingB = b.rating?.ratingValue || 0;
        return ratingB - ratingA; // Sorts in descending order
      } else if (sortOrder === "readStatus") {
        return a.readStatus.localeCompare(b.readStatus);
      }
      return 0;
    });
  };

  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  if (!Auth.loggedIn()) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <br />

      <div>
        {/* <div style={{ border: "1px solid #1a1a1a" }}></div> */}

        <Text fontSize="20px" align="center">
          Your Collection
        </Text>
        <br />
        <Center>
          <HStack spacing={4} flexWrap="wrap">
            <Button onClick={() => setSortOrder("title")}>Sort by title</Button>
            <Button onClick={() => setSortOrder("author")}>
              Sort by author
            </Button>
            <Button onClick={() => setSortOrder("rating")}>
              Sort by rating
            </Button>
            <Button onClick={() => setSortOrder("readStatus")}>
              Sort by read status
            </Button>
          </HStack>
        </Center>
        <SearchBooksForm />
        <Box w="100%" p={8}>
          <SimpleGrid minChildWidth="240px" spacing="40px">
            {sortBooks(data?.me?.library)?.map((userBook) => {
              return (
                <BookCard
                  key={userBook.book._id}
                  bookId={userBook.book._id}
                  img={userBook.book.cover_img_url}
                  authors={userBook.book.authors}
                  title={userBook.book.title}
                  ratingValue={userBook.rating?.ratingValue}
                  readStatus={userBook.readStatus}
                  addRating={handleAddRating}
                  changeReadStatus={handleChangeReadStatus}
                />
              );
            })}
          </SimpleGrid>
        </Box>
      </div>
    </>
  );
};

export default UserLibrary;
