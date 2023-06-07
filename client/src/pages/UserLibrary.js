import React from "react";
import { useQuery } from "@apollo/client";

import { QUERY_ME } from "../utils/queries";
import BookCard from "../components/BookCard";

const UserLibrary = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const library = data?.library || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? <div>Loading...</div> : <BookCard library={library} />}
        </div>
      </div>
    </main>
  );
};

export default UserLibrary;
