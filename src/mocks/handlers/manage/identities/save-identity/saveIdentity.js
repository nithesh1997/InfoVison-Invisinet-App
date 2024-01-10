import { rest } from "msw";
import { payload } from "./payload";

export function saveIdentity({ BASE_URL }) {
  const url = `${BASE_URL}/saveIdentity`;

  return rest.post(url, (req, res, ctx) => {
    const requestPayload = req.json();

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
