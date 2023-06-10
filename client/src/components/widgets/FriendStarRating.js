import React, { useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { BsStarFill } from "react-icons/bs";

export default function FriendStarRating({ ratingValue }) {
  const [rating, setRating] = useState(ratingValue);

  return (
    <HStack spacing={"2px"}>
      {[...Array(5)].map((star, index) => {
        const newRatingValue = index + 1;
        return (
          <Box
            as="label"
            key={index}
            color={newRatingValue <= rating ? "#ce5888" : "#e4e5e9"}
          >
            <BsStarFill cursor={"pointer"} size={20} transition="color 200ms" />
          </Box>
        );
      })}
    </HStack>
  );
}
