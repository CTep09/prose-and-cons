import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { QUERY_ME } from "../utils/queries";

const useUser = () => {
  const navigate = useNavigate();

  // const { loading, error, data } = useQuery(QUERY_ME);
  const { loading, error, data } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(),
  });

  useEffect(() => {
    if (!loading && !Auth.loggedIn()) {
      navigate("/login");
    }
  }, [loading]);

  return { loading, error, user: data?.me };
};

export default useUser;
