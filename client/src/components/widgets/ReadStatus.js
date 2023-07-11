import React, { useState } from "react";
import { Button, Flex, HStack, Tag } from "@chakra-ui/react";

export default function ReadStatus({ readStatus, bookId, changeReadStatus }) {
  const [currentStatus, setCurrentStatus] = useState(readStatus);

  const statusOptions = [
    "Read",
    "Want to Read",
    "On the Fence",
    "Not Interested",
  ];
  const statusColors = ["blue", "green", "yellow", "red"];

  const handleStatusChange = async (statusValue) => {
    setCurrentStatus(statusValue);
    await changeReadStatus(statusValue, bookId);
  };

  return (
    <Flex wrap="wrap">
      {/* <HStack spacing={2} mt={4}> */}
      {[...Array(4)].map((button, index) => {
        const statusValue = statusOptions[index];
        const statusColor = statusColors[index];

        return (
          <Button
            key={statusValue}
            size="xs"
            colorScheme={currentStatus === statusValue ? statusColor : "gray"}
            onClick={() => handleStatusChange(statusValue)}
          >
            {statusValue}
          </Button>
        );
      })}
      {/* </HStack> */}
    </Flex>
  );
}
