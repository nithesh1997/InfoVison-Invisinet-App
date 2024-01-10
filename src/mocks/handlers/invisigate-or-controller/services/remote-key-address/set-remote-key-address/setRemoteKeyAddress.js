import { rest } from "msw";

export function setRemoteKeyAddress({ BASE_URL }) {
  const url = `${BASE_URL}/setRemoteKeyAddress`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const context = req.url.searchParams.get("context");

    return res(ctx.delay(0), ctx.status(204));
  });
}
