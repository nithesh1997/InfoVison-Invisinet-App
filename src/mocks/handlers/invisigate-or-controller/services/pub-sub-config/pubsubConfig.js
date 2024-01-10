import { rest } from "msw";
import { payload } from "./payload";

export function pubsubConfig({ BASE_URL }) {
  const url = `${BASE_URL}/pubsub/config`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
