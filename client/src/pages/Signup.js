import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouteLink,
} from "react-router-dom";
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
} from "@chakra-ui/react";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

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
      window.location.href = "/userLibrary";
    } catch (e) {
      console.error(e);
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  return (
    <main>
      <Center>
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" padding="25px">
          <Center>
            <h4>Sign Up</h4>
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
                      <FormHelperText>
                        We'll never share your email.
                      </FormHelperText>
                    </Center>

                    <Input
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

                    <br></br>
                    <Center>
                      <Button
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
                <br></br>
                <Center>
                  <Text>
                    Already have an account?{" "}
                    <Link color="teal.500" href="/">
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
    </main>
  );
};

export default Signup;
