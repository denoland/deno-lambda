import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

// deno-lint-ignore require-await
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { "content-type": "text/html;charset=utf8" },
    body: `Welcome to deno ${Deno.version.deno} 🦕`,
  };
}
