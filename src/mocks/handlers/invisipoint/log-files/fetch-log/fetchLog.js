import { rest } from "msw";
import { payload } from "./payload";

export function fetchLog({ BASE_URL }) {
  const url = `${BASE_URL}/fetchLog`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const endpointID = req.url.searchParams.get("endpointId");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success[0]));
  });
}
