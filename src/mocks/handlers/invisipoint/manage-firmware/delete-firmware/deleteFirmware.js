import { rest } from "msw";

export function deleteFirmware({ BASE_URL }) {
  const url = `${BASE_URL}/deleteFirmware`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");

    return res(ctx.delay(0), ctx.status(204));
  });
}
