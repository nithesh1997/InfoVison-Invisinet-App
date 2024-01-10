import { rest } from "msw";

export function getToTrustedFilterRules({ BASE_URL }) {
  const url = `${BASE_URL}/getToTrustedFilter`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const context = req.url.searchParams.get("context");
    const page = req.url.searchParams.get("page");

    return res(ctx.delay(0), ctx.status(200), ctx.json());
  });
}
