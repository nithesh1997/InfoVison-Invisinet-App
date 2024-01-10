import { development } from "./development";
import { production } from "./production";

export const apiConfig = {
  "default-env":
    process.env.NODE_ENV === "production"
      ? "production-on-gateway"
      : "development-with-mock",
  "production-on-gateway": production,
  "development-with-mock": development,
};
