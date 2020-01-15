import { DynamoDBClient, createClient } from "./deps.ts";

const conf = {
  accessKeyId: Deno.env("AWS_ACCESS_KEY_ID"),
  secretAccessKey: Deno.env("AWS_SECRET_ACCESS_KEY"),
  sessionToken: () => Deno.env("AWS_SESSION_TOKEN"),
  region: Deno.env("AWS_REGION") || "local",
  port: Deno.env("AWS_REGION") ? 443 : 8000
};

export const client: DynamoDBClient = createClient(conf);
