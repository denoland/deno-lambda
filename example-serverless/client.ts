import { DynamoDBClient, createClient } from "./deps.ts";

export const client: DynamoDBClient = createClient();
