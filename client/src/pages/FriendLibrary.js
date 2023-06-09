import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Button, Grid, Spinner } from "@chakra-ui/react";

import { GET_FRIENDS } from "../utils/queries";
import { REMOVE_FRIEND } from "../utils/mutations";
import { SearchUsersForm } from "../components/SearchUsersForm";

export default function FriendLibrary() {
  const { loading, error, data } = useQuery(GET_FRIENDS);
  const [removeFriend, { loading: removeFriendLoading }] =
    useMutation(REMOVE_FRIEND);

  const handleRemoveFriend = async (friendId) => {
    console.log(friendId);
    try {
      await removeFriend({
        variables: { friendId: friendId },
        refetchQueries: [{ query: GET_FRIENDS }],
      });
      console.log("Friend removed");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Box maxWidth="400px" margin="0 auto">
      <SearchUsersForm />
      {data &&
        data.me &&
        data.me.friends &&
        data.me.friends.map((friend) => (
          <Box
            key={friend._id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            mb={4}
          >
            <Grid templateColumns="repeat(2, 1fr)">
              <div>
                <p>Username: {friend.username}</p>
                <p>Email: {friend.email}</p>
              </div>

              <Button
                colorScheme="teal"
                onClick={() => handleRemoveFriend(friend._id)}
              >
                Remove Friend
              </Button>
            </Grid>
          </Box>
        ))}
    </Box>
  );
}
