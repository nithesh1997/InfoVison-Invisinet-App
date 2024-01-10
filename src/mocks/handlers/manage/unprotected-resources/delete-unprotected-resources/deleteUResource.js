import { rest } from "msw";

export function deleteUnprotectedResource({ BASE_URL }) {
  const url = `${BASE_URL}/deleteUResource`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const requestPayload = req.json();

    return res(ctx.delay(0), ctx.status(204));
  });
}
