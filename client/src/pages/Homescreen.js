import React from "react";
import logo from "../images/prose-n-cons-logo.png";
import { Image, Center, Box } from "@chakra-ui/react";

import AuthService from "../utils/auth";

const Homescreen = () => {
  return (
    <Center bg="black" h="90vh">
      <Box>
        <Image src={logo} alt="Prose and Cons Logo" maxW="200px" />
      </Box>
    </Center>
  );
};

export default Homescreen;
