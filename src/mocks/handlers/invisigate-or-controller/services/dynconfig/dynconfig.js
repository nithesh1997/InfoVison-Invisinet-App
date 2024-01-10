import { rest } from "msw";
import { payload } from "./payload";

export function dynconfig({ BASE_URL }) {
  const url = `${BASE_URL}/dynconfig`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const context = req.url.searchParams.get("context");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
