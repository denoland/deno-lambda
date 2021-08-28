import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "../runtime/mod.ts";

// deno-lint-ignore require-await
export async function handler(
  _event: APIGatewayProxyEventV2,
  _context: Context,
): Promise<APIGatewayProxyResultV2> {
  return location.toString();
}
