import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { ChakraProvider, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button, Center } from "@chakra-ui/react";

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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ChakraProvider>
      <main className="flex-row justify-center mb-4">
        <div className="col-12 col-lg-10">
          <div className="card">
            <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
            <div className="card-body">
              {data ? (
                <p>
                  Success! You may now head{" "}
                  <Link to="/">back to the homepage.</Link>
                </p>
              ) : (
                <form onSubmit={handleFormSubmit}>

                  <FormControl>
                  <Center>
                    <FormHelperText>We'll never share your email.</FormHelperText>
                    </Center>
                    <Center>
                    <Input w='250px'
                      className="form-input"
                      placeholder="Your username"
                      name="username"
                      type="text"
                      value={formState.username} // corrected value name
                      onChange={handleChange}
                    />
                    </Center>

                    <Center>
                    <Input w='250px'
                      className="form-input"
                      placeholder="Your email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                    </Center>

                    <Center>
                    <Input w='250px'
                      className="form-input"
                      placeholder="******"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleChange}
                    />
                    </Center>
                    
                    <Center>
                <Button w='250px'
                  colorScheme='teal'
                  style={{ cursor: "pointer" }}
                  type="submit"
                >Submit
                </Button>
                </Center>
                
                  </FormControl>

                </form>
              )}
              {error && (
                <div className="my-3 p-3 bg-danger text-white">
                  {error.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ChakraProvider>
  );
};

export default Signup;