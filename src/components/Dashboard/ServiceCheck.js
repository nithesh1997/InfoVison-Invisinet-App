import React from "react";
import Styled from "./MaterialComponents/ServiceCheck.style";

const ServiceCheck = (props) => {
  return (
    <React.Fragment>
      <Styled.Box>
        {props.check ? (
          <Styled.BoxCheck>
            <Styled.CheckIcon />
          </Styled.BoxCheck>
        ) : (
          <Styled.BoxCancel>
            <Styled.CancelIcon />
          </Styled.BoxCancel>
        )}
      </Styled.Box>
    </React.Fragment>
  );
};
export default ServiceCheck;
