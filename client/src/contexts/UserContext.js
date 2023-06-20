// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = (props) => {
  // const { loading, error, user: userData } = useUser();
  // const {
  //   loading = false,
  //   error = null,
  //   user: userData = null,
  // } = useUser() || {};
  const { loading, error, user: userData } = useUser();
  const [user, setUser] = useState(userData);
  const [isDataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && userData) {
      setUser(userData);
      setDataLoaded(true);
    }
  }, [loading, userData]);

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
        updateUserLibraryWithRating,
        updateUserWithReadStatus,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
