export const requestResolver = (request, currentPayload) => {
  const actualContentType = request.headers["Content-Type"];

  const payload = currentPayload.data;
  const payloadType = typeof payload;
  const isPayloadZero = payload === 0;
  const isPayloadObject = payloadType !== "object";
  const isPayloadBooleanString = payload === "true" || payload === "false";

  const data = isPayloadZero ? String(payload) : payload;

  const contentType = isPayloadObject ? "text/plain" : actualContentType;

  const headers = {
    ...request.headers,
    "Content-Type": contentType,
    ...currentPayload.headers,
  };

  return { ...request, headers, data };
};
