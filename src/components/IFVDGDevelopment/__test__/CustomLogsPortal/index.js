import React, { useEffect, useState } from "react";
import { ClosePortal } from "./components/ClosePortal";
import { Backdrop, PortalContent, PortalWrapper } from "./styled-materials";

const CustomLogsPortal = ({ children, isDisplay }) => {
  const [isClosePortal, setIsClosePortal] = useState(false);

  const closePortal = React.useCallback(() => {
    setIsClosePortal(false);
  }, []);

  useEffect(() => {}, [isClosePortal]);

  return (
    <Backdrop isDisplay={isDisplay}>
      <PortalWrapper>
        <ClosePortal closePortal={closePortal} />
        <PortalContent>{children}</PortalContent>
      </PortalWrapper>
    </Backdrop>
  );
};

export default CustomLogsPortal;
