import { rest } from "msw";

export function rebootGateway({ BASE_URL }) {
  const url = `${BASE_URL}/haltGateway`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");

    return res(ctx.delay(0), ctx.status(200), ctx.text(""));
  });
}
