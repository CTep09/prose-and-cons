// import * as React from "react";
import React, { useState } from "react";
import Login from "./pages/Login";

// import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const [menuItem] = useState([
    { name: "Login" },
    { name: "Signup" },
    { name: "Home" },
  ]);
  const [currentPage, setCurrentPage] = useState(menuItem[0]);
  const [pageSelected, setPageSelected] = useState(false);

  return (
    <div className="App">
    <Login
      menuItem={menuItem}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      pageSelected={pageSelected}
      setPageSelected={setPageSelected}/>
    <section className="hero">
      <div className="hero-name">
      <h1>Hello World.</h1>
      <p>This is Prose and Cons.</p>
      </div>
      </section>
      </div>


  );
}

export default App;
