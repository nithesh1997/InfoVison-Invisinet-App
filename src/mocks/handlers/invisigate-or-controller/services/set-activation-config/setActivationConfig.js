import { rest } from "msw";

export function setActivationConfig({ BASE_URL }) {
  const url = `${BASE_URL}/setActivationConfig`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");

    return res(ctx.delay(0), ctx.status(204));
  });
}
