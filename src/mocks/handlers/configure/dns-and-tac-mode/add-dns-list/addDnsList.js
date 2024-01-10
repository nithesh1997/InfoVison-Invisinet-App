import { rest } from "msw";

export function addDnsList({ BASE_URL }) {
  const url = `${BASE_URL}/addDnsList`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const dnslist = req.url.searchParams.get("dnslist");

    return res(ctx.delay(0), ctx.status(204));
  });
}
