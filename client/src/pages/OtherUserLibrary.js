import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import Auth from "../utils/auth";

import { Text, SimpleGrid } from "@chakra-ui/react";

import { AddIcon, Search2Icon } from "@chakra-ui/icons";

import { QUERY_ME, QUERY_SINGLE_USER } from "../utils/queries";
import FriendBookCard from "../components/cards/FriendBookCard";
import FriendLibraryRecForm from "../components/forms/FriendLibraryRecForm";

const OtherUserLibrary = () => {
  const { username } = useParams();

  const navigate = useNavigate();

  const {
    loading: meLoading,
    error: meError,
    data: meData,
  } = useQuery(QUERY_ME);
  const {
    loading: otherUserLoading,
    error: otherUserError,
    data: otherUserData,
  } = useQuery(QUERY_SINGLE_USER, {
    variables: { username: username },
  });

  const loading = meLoading || otherUserLoading;

  useEffect(() => {
    if (!loading) {
      console.log(meData || meError);
      console.log(otherUserData || otherUserError);
    }
  }, [loading, meData, meError, otherUserData, otherUserError]);

  if (meLoading || otherUserLoading) return <p>Loading...</p>;
  if (meError || otherUserError) return <p>Error...</p>;

  return (
    <>
      <div className="flex-row justify-center">
        <Text fontSize="20px" align="center">
          {username}'s Collection
        </Text>

        <FriendLibraryRecForm meData={meData} otherUserData={otherUserData} />
        <SimpleGrid minChildWidth="240px" spacing="40px">
          {otherUserData?.user?.library?.map((userBook) => {
            return (
              <FriendBookCard
                key={userBook.book._id}
                img={userBook.book.cover_img_url}
                authors={userBook.book.author}
                title={userBook.book.title}
                ratingValue={userBook.rating?.ratingValue}
                readStatus={userBook.readStatus}
              />
            );
          })}
        </SimpleGrid>
      </div>
    </>
  );
};

export default OtherUserLibrary;
