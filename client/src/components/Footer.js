import React from "react";

import { Link as RouteLink } from "react-router-dom";

import {
  Box,
  chakra,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";
import { ReactNode } from "react";

import Auth from "../utils/auth";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode,
  label: string,
  href: string,
}) => {
  return (
    <RouteLink to={href}>
      <chakra.button
        bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
        rounded={"full"}
        w={8}
        h={8}
        cursor={"pointer"}
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"center"}
        transition={"background 0.3s ease"}
        _hover={{
          bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
        }}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    </RouteLink>
  );
};

export default function SmallCentered() {
  const isLoggedIn = Auth.loggedIn();

  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      {isLoggedIn && (
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          spacing={4}
          justify={"center"}
          align={"center"}
        >
          <Stack direction={"row"} spacing={6}>
            <RouteLink to={"/userLibrary"}>Library</RouteLink>
            <RouteLink to={"/friendLibrary"}>Friends</RouteLink>
            <RouteLink to={"/recommendations"}>Recommendations</RouteLink>
          </Stack>
        </Container>
      )}

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          // maxW={"6xl"}
          py={4}
          // direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text>© 2023 Prose & Cons. All rights reserved</Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton
              label={"GitHub"}
              href={"https://github.com/CTep09/prose-and-cons"}
            >
              <FaGithub />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
