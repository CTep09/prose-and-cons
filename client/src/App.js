import * as React from "react";
import Navbar from "./components/Navbar";
import BookCard from "./components/BookCard";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Navbar />
        <BookCard />
        <h1>Hello World.</h1>
        <p>This is Prose and Cons.</p>
      </div>
    </ChakraProvider>
  );
}

export default App;
