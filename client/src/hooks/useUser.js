import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { QUERY_ME } from "../utils/queries";

const useUser = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(QUERY_ME);

  if (!loading && !Auth.loggedIn()) {
    navigate("/login");
    return null;
  }

  return { loading, error, user: data?.me };
};

export default useUser;
