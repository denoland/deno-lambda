import { createClient, DynamoDBClient } from "./deps.ts";

export const client: DynamoDBClient = createClient();
