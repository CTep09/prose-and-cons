// Import React
import * as React from "react";

// Import necessary Apollo Client modules
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components for routing
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FriendLibrary from "./pages/FriendLibrary";
import Recommendations from "./pages/Recommendations";
import UserLibrary from "./pages/UserLibrary";
import Footer from "./components/Footer";
import OtherUserLibrary from "./pages/OtherUserLibrary";
import Homescreen from "./pages/Homescreen";

// Import context providers
import { ChakraProvider, Box } from "@chakra-ui/react";
import { UserProvider } from "./contexts/UserContext";

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  //uri: "http://localhost:3001/graphql",
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Router>
          <UserProvider>
            <Box minHeight="100vh" display="flex" flexDirection="column">
              <Navbar />
              <Box flex="1">
                <main>
                  <Routes>
                    <Route path="/" element={<Homescreen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                      path="/recommendations"
                      element={<Recommendations />}
                    />
                    <Route path="/friendLibrary" element={<FriendLibrary />} />
                    <Route path="/userLibrary" element={<UserLibrary />} />
                    <Route
                      path="/friendLibrary/:username"
                      element={<OtherUserLibrary />}
                    />
                  </Routes>
                </main>
              </Box>
              <Footer />
            </Box>
          </UserProvider>
        </Router>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default App;
