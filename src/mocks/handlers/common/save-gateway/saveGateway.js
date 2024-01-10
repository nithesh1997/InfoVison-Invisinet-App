import { rest } from "msw";
import { payload } from "./payload";

export function saveGateway({ BASE_URL }) {
  const url = `${BASE_URL}/saveGateway`;

  return rest.post(url, (req, res, ctx) => {
    const { address } = req.json();

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
