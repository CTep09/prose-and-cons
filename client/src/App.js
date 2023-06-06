import * as React from "react";
import Navbar from "./components/Navbar";


function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <h1>Hello World.</h1>
        <p>This is Prose and Cons.</p>
      </div>
    </ChakraProvider>
  );
}

export default App;
