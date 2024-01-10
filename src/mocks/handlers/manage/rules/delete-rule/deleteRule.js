import { rest } from "msw";

export function deleteRule({ BASE_URL }) {
  const url = `${BASE_URL}/deleteRule`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gaetwayIP");
    const requestPayload = req.json();

    return res(ctx.delay(0), ctx.status(204));
  });
}
