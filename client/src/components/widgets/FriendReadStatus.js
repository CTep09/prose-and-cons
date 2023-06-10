import React, { useState } from "react";
import { Button, HStack } from "@chakra-ui/react";

export default function FriendReadStatus({ readStatus }) {
  const [currentStatus, setCurrentStatus] = useState(readStatus);

  const statusOptions = ["Read", "Want to Read", "Not Interested"];
  const statusColors = ["blue", "green", "red"];

  return (
    <HStack spacing={2} mt={4}>
      {[...Array(3)].map((button, index) => {
        const statusValue = statusOptions[index];
        const statusColor = statusColors[index];

        return (
          <Button
            key={statusValue}
            size="xs"
            colorScheme={currentStatus === statusValue ? statusColor : "gray"}
          >
            {statusValue}
          </Button>
        );
      })}
    </HStack>
  );
}
