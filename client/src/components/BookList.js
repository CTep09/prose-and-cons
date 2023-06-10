import React from "react";

import BookCard from "../cards/BookCard";

const BookList = ({ library }) => {
  return (
    <>
      {library.map((book) => (
        <BookCard />
      ))}
    </>
  );
};

export default BookList;
