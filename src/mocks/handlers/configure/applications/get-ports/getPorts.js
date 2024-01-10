import { rest } from "msw";
import { payload } from "./payload";

export function getPorts({ BASE_URL }) {
  const url = `${BASE_URL}/getPorts`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");
    const offset = req.url.searchParams.get("offset");
    const limit = req.url.searchParams.get("limit");

    return res(
      ctx.delay(0),
      ctx.status(200),
      ctx.json(payload.success[`${offset}-${limit}`]),
    );
  });
}
