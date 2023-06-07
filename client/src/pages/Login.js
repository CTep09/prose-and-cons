import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
// import  App  from "../App";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Center,
  Box,
  Text,
  Link,
} from "@chakra-ui/react";

import AuthService from "../utils/auth";

const Login = (props) => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      AuthService.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: "",
      password: "",
    });
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <main>
      <Center>
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" padding="25px">
          <Center>
            <h4>Login</h4>
          </Center>
          <br></br>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{" "}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <Input
                  w="250px"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />

                <InputGroup w="250px">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <br></br>
                <Button
                  w="250px"
                  colorScheme="teal"
                  style={{ cursor: "pointer" }}
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            )}
            <br></br>


            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
            <Text>
              Don't have an account? {' '} 
            <Link color='teal.500' href='/signup'>
            Sign up
            </Link>
            </Text>
        </Box>
      </Center>
    </main>
  );
};

export default Login;
