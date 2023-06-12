import React, { useState } from "react";

import { Button, Flex, Box, Spacer } from "@chakra-ui/react";

import { CheckIcon } from "@chakra-ui/icons";

export default function MakeRecBtn({
  book,
  handleMakeRec,
  friendId,
  handleRemoveRec,
}) {
  const [recommended, setRecommended] = useState(false);
  const makeRecommendation = async (friendId, bookId) => {
    await handleMakeRec(friendId, bookId);
    setRecommended(!recommended);
  };
  const removeRecommendation = async (friendId, bookId) => {
    await handleRemoveRec(friendId, bookId);
    setRecommended(!recommended);
  };

  return (
    <Box justify="center" padding={4}>
      <Flex>
        <Box width="240px">
          <h2>{book.title}</h2>
        </Box>
        <Spacer />
        {recommended ? (
          <Button
            w="80px"
            colorScheme={"teal"}
            onClick={() => removeRecommendation(friendId, book._id)}
          >
            <CheckIcon />
          </Button>
        ) : (
          <Button
            w="80px"
            onClick={() => makeRecommendation(friendId, book._id)}
          >
            Select
          </Button>
        )}
      </Flex>
    </Box>
  );
}
