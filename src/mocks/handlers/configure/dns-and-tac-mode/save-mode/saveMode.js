import { rest } from "msw";

export function saveMode({ BASE_URL }) {
  const url = `${BASE_URL}/saveMode`;

  return rest.post(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const mode = req.url.searchParams.get("mode");

    return res(ctx.delay(0), ctx.status(200), ctx.json());
  });
}
