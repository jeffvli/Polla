import React from "react";

const PollBoxSkeleton = () => {
  return (
    <div>
      <Center>
        <Stack>
          <CircularProgress isIndeterminate color="blue.300" m="auto" />
          <Text>Loading Results...</Text>
        </Stack>
      </Center>
      <ResponsiveBox variant="bordered" isLoading>
        <Box
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        >
          <Stack>
            <CircularProgress isIndeterminate color="blue.300" m="auto" />
            <Text>Loading Results...</Text>
          </Stack>
        </Box>
        <Box sx={{ filter: "blur(8px)" }}>
          <Box textAlign="center" pb={"3rem"}>
            <Heading>Poll Title</Heading>
          </Box>
          <Stack spacing={8}>
            {[1, 2, 3].map(() => (
              <Box key={nanoid()}>
                <Flex>
                  <Text fontSize="xl">Placeholder</Text>
                  <Spacer />
                  <Text fontSize="sm" alignSelf="flex-start">
                    XX.X% (X votes)
                  </Text>
                </Flex>
                <Progress colorScheme="blue" size="md" value={0} isAnimated />
              </Box>
            ))}
          </Stack>
          <Divider mt={5} mb={5} />
          <Text>{"Created → X minutes ago • user"}</Text>
        </Box>
      </ResponsiveBox>
    </div>
  );
};

export default PollBoxSkeleton;
