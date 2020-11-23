import type {
  APIGatewayProxyEvent,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

function decorate(target: unknown) {}

@decorate
class Foo {
}

export function handler(event: APIGatewayProxyEvent, context: Context) {
  return {
    statusCode: 200,
    body: `decorated 🦕`,
  };
}
