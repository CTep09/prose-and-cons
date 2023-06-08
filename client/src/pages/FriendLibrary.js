import React from "react";
import { useQuery } from '@apollo/client';
import { Box, Spinner } from "@chakra-ui/react";

import { GET_FRIENDS } from "../utils/queries";

export default function FriendsList() {
  const { loading, error, data } = useQuery(GET_FRIENDS);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const friendsData = data.me.friends;

  return (
    <Box maxWidth="400px" margin="0 auto">
      {friendsData.map(friend => (
        <Box key={friend._id} borderWidth="1px" borderRadius="md" p={4} mb={4}>
          <p>Username: {friend.username}</p>
          <p>Email: {friend.email}</p>
        </Box>
      ))}
    </Box>
  );
}
  
  
  
  