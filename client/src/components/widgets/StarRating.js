import React, { useState } from "react";
import { Box, HStack, Radio } from "@chakra-ui/react";
import { BsStarFill } from "react-icons/bs";

export default function StarRating({ ratingValue, bookId, addRating }) {
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(ratingValue);

  const handleRatingChange = async (newRatingValue) => {
    setRating(newRatingValue);
    await addRating(newRatingValue, bookId); // Call the addRating function
  };

  return (
    <HStack spacing={"2px"}>
      {[...Array(5)].map((star, index) => {
        const newRatingValue = index + 1;
        return (
          <Box
            as="label"
            key={index}
            color={newRatingValue <= (hover || rating) ? "#ce5888" : "#e4e5e9"}
            onMouseEnter={() => setHover(newRatingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <Radio
              name="rating"
              onChange={() => handleRatingChange(newRatingValue)} // Use the new handler here
              value={newRatingValue}
              display="none"
            ></Radio>
            <BsStarFill cursor={"pointer"} size={20} transition="color 200ms" />
          </Box>
        );
      })}
    </HStack>
  );
}
