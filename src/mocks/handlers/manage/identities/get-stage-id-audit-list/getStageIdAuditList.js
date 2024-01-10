import { rest } from "msw";
import { payload } from "./payload";

export function getStageIdAuditList({ BASE_URL }) {
  const url = `${BASE_URL}/getStgIdAuditList`;

  return rest.get(url, (req, res, ctx) => {
    const gatewayIP = req.url.searchParams.get("gatewayIP");

    return res(ctx.delay(0), ctx.status(200), ctx.json(payload.success));
  });
}