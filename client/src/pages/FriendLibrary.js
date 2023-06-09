import React from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, Grid, Spinner } from "@chakra-ui/react";

import { GET_FRIENDS } from "../utils/queries";
import { SearchUsersForm } from "../components/SearchUsersForm";

export default function FriendLibrary() {
  const { loading, error, data } = useQuery(GET_FRIENDS);

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

              <Button>Remove Friend</Button>
            </Grid>
          </Box>
        ))}
    </Box>
  );
}
