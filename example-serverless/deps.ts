export {
  createClient,
  Doc,
  DynamoDBClient
} from "https://deno.land/x/dynamodb@v0.2.0/mod.ts";

import { v4 } from "https://deno.land/std@v0.37.0/uuid/mod.ts";
export const uuid = v4.generate;
