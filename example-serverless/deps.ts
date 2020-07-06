export {
  createClient,
  Doc,
  DynamoDBClient,
} from "https://deno.land/x/dynamodb@v1.0.0/mod.ts";

import { v4 } from "https://deno.land/std@0.60.0/uuid/mod.ts";
export const uuid = v4.generate;
