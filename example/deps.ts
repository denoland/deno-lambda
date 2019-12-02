// FIXME there are no releases of dynamodb atm.
//export { createClient, Doc, DynamoDBClient } from "https://deno.land/x/dynamodb/mod.ts";
// export { createClient, Doc, DynamoDBClient } from "./dynamodb/mod.ts";
export {
  createClient,
  Doc,
  DynamoDBClient
} from "https://raw.githubusercontent.com/hayd/dynamodb/782f64ce64e7c83f964970c7eeacba0d5c9dfb91/mod.ts";

export { v4 as uuid } from "https://deno.land/std@v0.25.0/uuid/mod.ts";
