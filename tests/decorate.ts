import type {
  APIGatewayProxyEventV2,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

function decorate(_target: unknown) {}

@decorate
class _Foo {
}

export function handler(_event: APIGatewayProxyEventV2, _context: Context) {
  return {
    statusCode: 200,
    body: `decorated 🦕`,
  };
}
