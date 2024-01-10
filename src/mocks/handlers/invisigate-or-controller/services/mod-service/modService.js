import { rest } from "msw";
import { payload } from "./payload";

export function modService({ BASE_URL }) {
  const url = `${BASE_URL}/modService`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams("gatewayIP");
    const context = req.url.searchParams("context");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
