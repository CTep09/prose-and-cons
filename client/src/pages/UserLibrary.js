/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
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

//import { QUERY_ME } from "../utils/queries";
import { ADD_RATING, CHANGE_READSTATUS } from "../utils/mutations";
import BookCard from "../components/cards/BookCard";

import SearchBooksForm from "../components/SearchBooksForm";

import { UserContext } from "../contexts/UserContext";

const UserLibrary = () => {
  const [sortOrder, setSortOrder] = useState("title");

  const {
    user,
    error,
    isDataLoaded,
    updateUserLibraryWithRating,
    updateUserWithReadStatus,
  } = useContext(UserContext);

  // Mutations
  const [addRating, { loading: addRatingLoading, error: addRatingError }] =
    useMutation(ADD_RATING, {
      onCompleted: (data) => {
        updateUserLibraryWithRating(data.addRating);
      },
    });

  //   { data: { addRating } }) {
  //     try {
  //       console.log(addRating);
  //       // First we retrieve existing profile data that is stored in the cache under the `QUERY_ME` query
  //       // Could potentially not exist yet, so wrap in a try/catch
  //       const { me } = cache.readQuery({ query: QUERY_ME });

  //       // Create a copy of the existing library array
  //       const updatedLibrary = [...me.library];
  //       console.log(updatedLibrary);
  //       // Find the book in the library that matches the book in the addRating result
  //       const bookIndex = updatedLibrary.findIndex(
  //         (userBook) => userBook.book._id === addRating.book._id
  //       );

  //       if (bookIndex !== -1) {
  //         const updatedBook = {
  //           ...updatedLibrary[bookIndex],
  //           rating: addRating,
  //         };
  //         updatedLibrary[bookIndex] = updatedBook;
  //       }

  //       // Then we update the cache by combining existing profile data with the newly updated library
  //       cache.writeQuery({
  //         query: QUERY_ME,
  //         // If we want new data to show up before or after existing data, adjust the order of this array
  //         data: { me: { ...me, library: updatedLibrary } },
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  // });
  const [
    changeReadStatus,
    { loading: changeReadStatusLoading, error: addReadStatusError },
  ] = useMutation(CHANGE_READSTATUS, {
    onCompleted: (data) => {
      updateUserWithReadStatus(data.changeReadStatus);
    },
  });

  //   update(cache, { data: { changeReadStatus } }) {
  //     try {
  //       const { me } = cache.readQuery({ query: QUERY_ME });

  //       cache.writeQuery({
  //         query: QUERY_ME,
  //         data: { me: { ...me, ...changeReadStatus } },
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  // });

  const handleAddRating = async (ratingValue, bookId) => {
    console.log(ratingValue, bookId);
    try {
      await addRating({
        variables: { ratingValue: ratingValue, bookId: bookId },
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
        if (a.book.title && b.book.title) {
          return a.book.title.localeCompare(b.book.title);
        }
      } else if (sortOrder === "author") {
        // Assuming authors is an array and we're sorting by the first author
        const authorA = a.book.authors[0]?.sortName || "";
        const authorB = b.book.authors[0]?.sortName || "";
        return authorA.localeCompare(authorB);
      } else if (sortOrder === "rating") {
        // Use 0 as a default rating for books without a rating
        const ratingA = a.ratingValue || 0;
        const ratingB = b.ratingValue || 0;
        return ratingB - ratingA; // Sorts in descending order
      } else if (sortOrder === "readStatus") {
        const readStatusA = a.readStatus || "";
        const readStatusB = b.readStatus || "";
        return readStatusA.localeCompare(readStatusB);
      }
      return 0;
    });
  };

  const navigate = useNavigate();

  if (!isDataLoaded) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  if (!Auth.loggedIn()) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <div>
        {/* <div style={{ border: "1px solid #1a1a1a" }}></div> */}
        <Text fontSize="20px" align="center" marginTop="5" marginBottom="5">
          Your Collection
        </Text>
        {/* <Center> */}
        <HStack spacing={4} flexWrap="wrap" justifyContent="center">
          <Button onClick={() => setSortOrder("title")}>Sort by title</Button>
          <Button onClick={() => setSortOrder("author")}>Sort by author</Button>
          <Button onClick={() => setSortOrder("rating")}>Sort by rating</Button>
          <Button onClick={() => setSortOrder("readStatus")}>
            Sort by read status
          </Button>
        </HStack>
        {/* </Center> */}
        <SearchBooksForm />
        <Box w="100%" p={8}>
          <SimpleGrid minChildWidth="240px" spacing="40px">
            {sortBooks(user?.library)?.map((userBook) => {
              return (
                <BookCard
                  key={userBook.book._id}
                  bookId={userBook.book._id}
                  img={userBook.book.cover_img_url}
                  authors={userBook.book.authors}
                  title={userBook.book.title}
                  ratingValue={userBook.ratingValue}
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
