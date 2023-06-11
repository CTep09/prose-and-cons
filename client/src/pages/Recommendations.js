import React, { useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import BookCard from "../components/cards/BookCard";
import { ADD_RATING, CHANGE_READSTATUS } from "../utils/mutations";
import { QUERY_RECS_BY_RECIPIENT } from "../utils/queries";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { Center, Flex, SimpleGrid, Text } from "@chakra-ui/react";

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
  const navigate = useNavigate();

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
      <Center>
        <Flex direction="column">
          <Text fontSize="20px" align="center">
            Books Recommended to You
          </Text>
          <Text>
            Give the books a rating or status to add them to your library.
          </Text>
        </Flex>
      </Center>
      {/* <div className="col-12 col-md-8 mb-3"> */}
      <SimpleGrid minChildWidth="240px" spacing="40px">
        {data?.recs?.map((rec, index) => {
          return (
            <BookCard
              key={`${rec.book_id}-${index}`}
              bookId={rec.book._id}
              img={rec.book.cover_img_url}
              authors={rec.book.authors}
              title={rec.book.title}
              ratingValue={rec.rating?.ratingValue}
              readStatus={rec?.readStatus}
              addRating={handleAddRating}
              changeReadStatus={handleChangeReadStatus}
              sender={rec.sender.username}
            />
          );
        })}
      </SimpleGrid>
    </div>
  );
};

export default Recommendations;
