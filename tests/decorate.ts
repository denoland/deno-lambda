import {
  APIGatewayProxyEvent,
  Context
} from "https://deno.land/x/lambda/mod.ts";

function decorate(target: any) {}

@decorate
class Foo {
}

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  return {
    statusCode: 200,
    body: `decorated 🦕`,
  };
}
