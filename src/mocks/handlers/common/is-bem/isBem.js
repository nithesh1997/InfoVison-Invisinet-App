import { rest } from "msw";
import { payload } from "./payload";

export function isBem({ BASE_URL }) {
  const url = `${BASE_URL}/isBem`;

  return rest.get(url, (req, res, ctx) => {
    return res(ctx.delay(0), ctx.status(200), ctx.json(payload));
  });
}
