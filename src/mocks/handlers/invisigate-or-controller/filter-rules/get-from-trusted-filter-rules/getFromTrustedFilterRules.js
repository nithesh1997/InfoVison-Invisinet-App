import { rest } from "msw";
import { payload } from "./payload";

export function getFromTrustedFilterRules({ BASE_URL }) {
  const url = `${BASE_URL}/getFromTrustedFilter`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const context = req.url.searchParams.get("context");
    const page = req.url.searchParams.get("page");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success[0]));
  });
}
