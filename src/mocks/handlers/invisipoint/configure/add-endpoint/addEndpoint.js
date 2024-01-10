import { rest } from "msw";
import { payload } from "./payload";

export function addEndpoint({ BASE_URL }) {
  const url = `${BASE_URL}/addEndpoint`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const requestPayload = req.json();

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
