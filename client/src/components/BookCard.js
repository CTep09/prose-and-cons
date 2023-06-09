import React from "react";
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Flex, Circle, Badge, Icon, chakra, Tooltip } from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

export default function BookCard(props) {
  function Rating({ rating, numReviews }) {
    return (
      <Flex alignItems="center">
        {Array(5)
          .fill("")
          .map((_, i) => {
            const roundedRating = Math.round(rating * 2) / 2;
            if (roundedRating - i >= 1) {
              return (
                <BsStarFill
                  key={i}
                  style={{ marginLeft: "1" }}
                  color={i < rating ? "teal.500" : "gray.300"}
                />
              );
            }
            if (roundedRating - i === 0.5) {
              return <BsStarHalf key={i} style={{ marginLeft: "1" }} />;
            }
            return <BsStar key={i} style={{ marginLeft: "1" }} />;
          })}
        <Box as="span" ml="2" color="gray.600" fontSize="sm">
          {numReviews} review{numReviews > 1 && "s"}
        </Box>
      </Flex>
    );
  }

  return (
    <Center py={12}>
        <Flex
        direction={["column", "column", "row"]} // Columns on mobile, row on other devices
        flexWrap="wrap"
        justifyContent="center"
      >
      
      <Box
        role={"group"}
        p={6}
        maxW={"280px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          align="center"
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "170px",
            h: "full",
            pos: "absolute",
            top: -1,
            left: 8,
            backgroundImage: `url(${props.img})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={150}
            objectFit={"cover"}
            src={props.img}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text
            color={"gray.500"}
            fontSize={"sm"}
            textTransform={"uppercase"}
          >
            {props.author}
          </Text>
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            {props.title}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Rating rating={props.review} numReviews={props.numReviews} />
          </Stack>
        </Stack>
      </Box>
      </Flex>
    </Center>
  );
}