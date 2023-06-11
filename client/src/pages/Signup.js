import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Center,
  InputGroup,
  InputRightElement,
  useToast,
  Box,
  Text,
  Link,
  Flex,
  Heading,
} from "@chakra-ui/react";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
      navigate("/userLibrary");
    } catch (e) {
      console.error(e);
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  return (
      <Flex justifyContent="center" alignItems="center" height="80vh">
      <Center>
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" padding="25px">
          <Center>
            <Heading as="h4" size="md">
              Sign Up
           </Heading>
           </Center>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{" "}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <Box>
                <form onSubmit={handleFormSubmit}>
                  <FormControl isInvalid={error}>
                    <Center>
                      <FormHelperText marginBottom="1">
                        We'll never share your email.
                      </FormHelperText>
                    </Center>

                    <Input
                    marginBottom="5"
                      w="250px"
                      className="form-input"
                      placeholder="Username"
                      name="username"
                      type="text"
                      value={formState.username}
                      onChange={handleChange}
                    />
                    <Center>
                      <Input
                      marginBottom="5"
                        w="250px"
                        className="form-input"
                        placeholder="Email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                      />
                    </Center>
                    <Center>
                      <InputGroup w="250px">
                        <Input
                        marginBottom="5"
                          pr="4.5rem"
                          type={show ? "text" : "password"}
                          placeholder="Password"
                          name="password"
                          value={formState.password}
                          onChange={handleChange}
                        />
                        <FormErrorMessage>
                          {error && error.message}
                        </FormErrorMessage>
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </Center>
                    <Center>
                      <Button
                      marginBottom="5"
                        w="250px"
                        colorScheme="teal"
                        style={{ cursor: "pointer" }}
                        type="submit"
                        // onClick={() =>
                        //   toast({
                        //     title: "Account created.",
                        //     status: "success",
                        //     duration: 3000,
                        //     isClosable: true,
                        //   })
                        // }
                      >
                        Submit
                      </Button>
                    </Center>
                  </FormControl>
                </form>
                <Center>
                  <Text>
                    Already have an account?{" "}
                    <Link color="teal.500" href="/login">
                      Login
                    </Link>
                  </Text>
                </Center>
              </Box>
            )}
            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </Box>
      </Center>
    </Flex>
  );
};

export default Signup;
