import { rest } from "msw";
import { payload } from "./payload";

export function configurationList({ BASE_URL }) {
  const url = `${BASE_URL}/configList`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const limit = req.url.searchParams.get("limit");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success[0]));
  });
}
