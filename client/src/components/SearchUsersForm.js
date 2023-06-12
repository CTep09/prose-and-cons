import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { ADD_FRIEND } from "../utils/mutations";
import { UserList } from "./UserList";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USERS, QUERY_ME } from "../utils/queries";

export const SearchUsersForm = () => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const meQuery = useQuery(QUERY_ME);
  const usersQuery = useQuery(QUERY_USERS);
  const [addFriend, { loading: addFriendLoading }] = useMutation(ADD_FRIEND);

  const loading = meQuery.loading || usersQuery.loading;

  useEffect(() => {
    if (!loading) {
      // At this point, loading is false, so the data is available.
      console.log(meQuery.data);
      console.log(usersQuery.data);
    }
  }, [loading, meQuery.data, usersQuery.data]);

  useEffect(() => {
    if (searchInput.length > 0 && meQuery.data && usersQuery.data) {
      const friends =
        meQuery.data.me && meQuery.data.me.friends
          ? meQuery.data.me.friends
          : [];
      const friendsIds = friends.map((friend) => friend._id);
      const users =
        usersQuery.data && usersQuery.data.users ? usersQuery.data.users : [];
      const filteredUsers = users.filter(
        (user) =>
          user.username.toLowerCase().startsWith(searchInput.toLowerCase()) &&
          !friendsIds.includes(user._id) &&
          !(user._id === meQuery.data.me._id)
      );
      setResults(filteredUsers.slice(0, 10)); // Limit to top 10 results
    } else {
      setResults([]); // Clear results when search input is empty
    }
  }, [meQuery.data, searchInput, usersQuery.data]);

  const handleAddFriend = async (friendId) => {
    console.log(friendId);
    try {
      await addFriend({
        variables: { friendId: friendId },
        refetchQueries: [{ query: QUERY_ME }],
      });
      console.log("Friend added");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form>
        <FormControl marginTop="5">
          <FormLabel>Search by ...</FormLabel>
          <InputGroup>
            <Input
              marginBottom="5"
              placeholder="Search by username"
              name="searchInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
            />
            <InputRightElement>
              <Search2Icon />
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
      <Flex direction="column">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <UserList results={results} onAddFriend={handleAddFriend} />
        )}
      </Flex>
    </>
  );
};
