import React, { useState } from "react";
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  HStack,
  Radio,
  Text,
  Stack,
  Image,
  Flex,
} from "@chakra-ui/react";
// import { Flex, Circle, Badge, Icon, chakra, Tooltip } from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

export default function StarRating({ ratingValue, bookId, addRating }) {
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(ratingValue);

  return (
    <HStack spacing={"2px"}>
      {[...Array(5)].map((star, index) => {
        const newRatingValue = index + 1;
        return (
          <Box
            as="label"
            key={index}
            color={newRatingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
            onMouseEnter={() => setHover(newRatingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <Radio
              name="rating"
              onChange={() => setRating(newRatingValue)}
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
