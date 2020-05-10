export {
  createClient,
  Doc,
  DynamoDBClient
} from "https://deno.land/x/dynamodb@v0.3.1/mod.ts";

import { v4 } from "https://deno.land/std@v0.50.0/uuid/mod.ts";
export const uuid = v4.generate;
