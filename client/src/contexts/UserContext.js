// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import useUser from "../hooks/useUser";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const { loading, error, user: userData } = useUser();
  const [user, setUser] = useState(userData);
  const [isDataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && userData) {
      console.log(userData);
      setUser(userData);
      setDataLoaded(true);
    }
  }, [loading, userData]);

  const updateUserLibraryWithBook = (book) => {
    if (user) {
      const updatedLibrary = [...user.library];
      const bookIndex = updatedLibrary.findIndex(
        (userBook) => userBook.book._id === book._id
      );

      if (bookIndex === -1) {
        updatedLibrary.push({
          book,
          ratingStatus: "Unrated",
          rating: null,
          readStatus: null,
        });

        setUser((prevUser) => ({ ...prevUser, library: updatedLibrary }));
      }
    }
  };

  const updateUserLibraryWithRating = (rating) => {
    if (user) {
      const updatedLibrary = [...user.library];
      const bookIndex = updatedLibrary.findIndex(
        (userBook) => userBook.book._id === rating.book._id
      );

      if (bookIndex !== -1) {
        const updatedBook = {
          ...updatedLibrary[bookIndex],
          rating: rating,
        };
        updatedLibrary[bookIndex] = updatedBook;

        setUser((prevUser) => ({ ...prevUser, library: updatedLibrary }));
      }
    }
  };

  const updateUserWithReadStatus = (changeReadStatus) => {
    if (user) {
      setUser((prevUser) => ({ ...prevUser, ...changeReadStatus }));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        isDataLoaded,
        setUser,
        updateUserLibraryWithBook,
        updateUserLibraryWithRating,
        updateUserWithReadStatus,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
