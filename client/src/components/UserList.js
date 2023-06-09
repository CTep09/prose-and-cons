import React from "react";
import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { ADD_FRIEND } from "../utils/mutations";

export function UserList({ results, onAddFriend }) {
  return (
    <>
      {results.map((user) => (
        <Flex
          key={user._id}
          p={2}
          px={8}
          my={4}
          bg="lightgray"
          w="100%"
          direction="row"
          justify="space-between"
          align="center"
        >
          <Text>{user.username}</Text>
          <Button colorScheme="teal" onClick={() => onAddFriend(user._id)}>
            Add Friend
          </Button>
        </Flex>
      ))}
    </>
  );
}
