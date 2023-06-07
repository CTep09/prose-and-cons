import React from "react";
import {  useQuery } from '@apollo/client';

import { GET_FRIENDS } from "../utils/queries";

export default function FriendsList() {
    const { loading, error, data } = useQuery(GET_FRIENDS);
    
    if (loading) {
      return <p>Loading...</p>;
    }
    
    if (error) {
      return <p>Error: {error.message}</p>;
    }
    
    const friendsData = data.me.friends;
    
    return (
      <div>
        {friendsData}
      </div>
    );
  }
  
  
  
  
  
  
  