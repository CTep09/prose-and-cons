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
import StarRating from "../widgets/StarRating";
import ReadStatus from "../widgets/ReadStatus";

export default function BookCard(props) {
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
            <Stack direction={"column"} align={"center"}>
              {/* <Rating
                rating={props.ratingValue}
                // numReviews={props.numReviews}
              /> */}
              <StarRating
                ratingValue={props.ratingValue}
                bookId={props.bookId}
                addRating={props.addRating}
              />
              <ReadStatus
                readStatus={props.readStatus}
                bookId={props.bookId}
                changeReadStatus={props.changeReadStatus}
              />
            </Stack>
          </Stack>
        </Box>
      </Flex>
    </Center>
  );
}
