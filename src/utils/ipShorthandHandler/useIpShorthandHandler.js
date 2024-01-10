import { useState, useEffect } from "react";

const useIpShorthandHandler = (ipv6) => {
  const [compressedIp, setCompressedIp] = useState();

  useEffect(() => {
    const compIP = ipv6.replace(/\b(?:0+:){2,}/, ":");

    const finalIPComp = compIP
      .split(":")
      .map(function (octet) {
        return octet.replace(/\b0+/g, "");
      })
      .join(":");

    setCompressedIp(finalIPComp);
  }, [ipv6]);

  return compressedIp;
};

export default useIpShorthandHandler;
