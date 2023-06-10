import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Button, Grid, Spinner } from "@chakra-ui/react";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

import { GET_FRIENDS } from "../utils/queries";
import { REMOVE_FRIEND } from "../utils/mutations";
import { SearchUsersForm } from "../components/SearchUsersForm";

export default function FriendLibrary() {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_FRIENDS);
  const [removeFriend, { loading: removeFriendLoading }] =
    useMutation(REMOVE_FRIEND);

  if (!Auth.loggedIn()) {
    navigate("/login");
    return null;
  }
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

  const viewLibrary = (username) => {
    console.log(username);
    navigate(`/friendLibrary/${username}`);
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
                <Button
                  colorScheme="teal"
                  onClick={() => viewLibrary(friend.username)}
                >
                  View Library
                </Button>
              </div>

              <Button onClick={() => handleRemoveFriend(friend._id)}>
                Remove Friend
              </Button>
            </Grid>
          </Box>
        ))}
    </Box>
  );
}
