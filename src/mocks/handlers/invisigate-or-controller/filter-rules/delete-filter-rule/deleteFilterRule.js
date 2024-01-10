import { rest } from "msw";

export function deleteFilterRule({ BASE_URL }) {
  const url = `${BASE_URL}/deleteFilterRule`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const context = req.url.searchParams.get("context");
    const trusted = req.url.searchParams.get("trusted");

    return res(ctx.delay(0), ctx.status(204));
  });
}
