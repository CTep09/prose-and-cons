import React, { useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import BookCard from "../components/cards/BookCard";
import { ADD_RATING, CHANGE_READSTATUS } from "../utils/mutations";
import { QUERY_RECS_BY_RECIPIENT } from "../utils/queries";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { SimpleGrid, Text, InputRightElement } from "@chakra-ui/react";
import auth from "../utils/auth";

const Recommendations = () => {
  const currentUserId = Auth.getProfile().data._id;
  console.log(currentUserId);
  const { loading, data, error } = useQuery(QUERY_RECS_BY_RECIPIENT, {
    variables: { recipientId: currentUserId },
  });
  const [addRating, { loading: addRatingLoading }] = useMutation(ADD_RATING);
  const [changeReadStatus, { loading: changeReadStatusLoading }] =
    useMutation(CHANGE_READSTATUS);

  const handleAddRating = async (ratingValue, bookId) => {
    console.log(ratingValue, bookId);
    try {
      await addRating({
        variables: { ratingValue: ratingValue, bookId: bookId },
        refetchQueries: [{ query: QUERY_RECS_BY_RECIPIENT }],
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
        refetchQueries: [{ query: QUERY_RECS_BY_RECIPIENT }],
      });
      console.log("Read Status changed");
    } catch (err) {
      console.error(err);
    }
  };
  const navigate = useNavigate();
  const initialRef = React.useRef(null);

  useEffect(() => {
    if (!loading) {
      // At this point, loading is false, so the data is available.
      console.log(data);
    }
  }, [loading, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  if (!Auth.loggedIn()) {
    navigate("/login");
    return null;
  }
  return (
    <div>
      <Text fontSize="20px" align="center">
        Your Collection
      </Text>
      {/* <div className="col-12 col-md-8 mb-3"> */}
      <SimpleGrid minChildWidth="240px" spacing="40px">
        {data?.recs?.library?.map((userBook) => {
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
    </div>
  );
};

export default Recommendations;
