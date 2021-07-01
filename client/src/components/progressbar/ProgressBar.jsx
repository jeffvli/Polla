import React, { useEffect, useState } from "react";

import { Progress } from "@chakra-ui/react";

const ProgressBar = ({ ...props }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return <Progress colorScheme={props.colorScheme} size="md" value={value} />;
};

export default ProgressBar;
