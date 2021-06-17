import {
  Box,
  Button,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";

import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";

const PollShare = ({ mt, mb, m }) => {
  const toast = useToast();
  const location = useLocation();
  const pollUrl = process.env.REACT_APP_BASE_URL + location.pathname;

  return (
    <Box mt={mt} mb={mb} m={m}>
      <ResponsiveBox variant="bordered">
        <Heading size="md" mb={3}>
          Share this poll
        </Heading>
        <InputGroup size="md">
          <Input value={pollUrl} pr="6rem" isReadOnly />
          <InputRightElement width="6rem">
            <Button
              h="2rem"
              size="sm"
              rightIcon={<CopyIcon />}
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              onClick={() => {
                navigator.clipboard.writeText(pollUrl);
                toast({
                  description: `The url has been copied to your clipboard.`,
                  status: "info",
                  duration: 2000,
                });
              }}
            >
              Copy
            </Button>
          </InputRightElement>
        </InputGroup>
      </ResponsiveBox>
    </Box>
  );
};

export default PollShare;
