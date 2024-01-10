import { rest } from "msw";
import { payload } from "./payload";

export function enableLayer3({ BASE_URL }) {
  const url = `${BASE_URL}/enableLayer3`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.failure));
  });
}
