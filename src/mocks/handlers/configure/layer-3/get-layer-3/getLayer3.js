import { rest } from "msw";
import { payload } from "./payload";

export function getLayer3({ BASE_URL }) {
  const url = `${BASE_URL}/getLayer3`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}