import React, { useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Icon,
  Box,
  Text,
  Spacer,
  SimpleGrid,
  Grid,
  useSafeLayoutEffect,
} from "@chakra-ui/react";

export default function MakeRecBtn({
  book,
  handleMakeRec,
  friendId,
  handleRemoveRec,
}) {
  const [recommended, setRecommended] = useState(false);
  const makeRecommendation = async (friendId, bookId) => {
    // await handleMakeRec(friendId, bookId);
    console.log(friendId);
    console.log(bookId);
    setRecommended(!recommended);
  };
  const removeRecommendation = async (friendId, bookId) => {
    // await handleRemoveRec(friendId, bookId);
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
          <Button onClick={() => removeRecommendation(friendId, book._id)}>
            Recommended
          </Button>
        ) : (
          <Button onClick={() => makeRecommendation(friendId, book._id)}>
            {" "}
            Select{" "}
          </Button>
        )}
      </Flex>
    </Box>
  );
}
