import { rest } from "msw";
import { payload } from "./payload";

export function login({ BASE_URL }) {
  const url = `${BASE_URL}/login`;

  return rest.post(url, async (req, res, ctx) => {
    const { userName, password } = await req.json();

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}
