import { rest } from "msw";
import { payload } from "./payload";

export function logout({ BASE_URL }) {
  const url = `${BASE_URL}/logout`;

  return rest.post(url, async (req, res, ctx) => {
    const requestPayload = await req.json();

    return res(ctx.delay(0), ctx.status(200), ctx.body(payload.success));
  });
}
