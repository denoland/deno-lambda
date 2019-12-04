import { Context, Event } from "https://deno.land/x/lambda/mod.ts";

import { client } from "../client.ts";
import { Doc, uuid } from "../deps.ts";

export const TableName = "candidates";

function ok(body: any, statusCode: number = 200) {
  return {
    statusCode,
    body: JSON.stringify(body)
  };
}
function error(message: string, statusCode: number = 500) {
  return ok({ message: message }, statusCode);
}

export async function get(event: Event, context: Context) {
  const id = event.pathParameters.id;
  const params = {
    TableName,
    Key: {
      id: id
    }
  };
  let result: Doc;
  try {
    result = await client.getItem(params);
  } catch (e) {
    return error(`unable to getItem\n${e}`);
  }
  if (result.Item) {
    return ok(result.Item);
  } else {
    return error(`Not Found: ${id}`, 404);
  }
}

export async function list(event: Event, context: Context) {
  var params = {
    TableName,
    ProjectionExpression: "id, fullname, email"
  };
  let result: any;
  try {
    result = await client.scan(params);
  } catch (e) {
    return error(`unable to scan\n${e}`);
  }
  try {
    // FIXME better way to handle this??
    const items = [];
    try {
      for await (const page of result) {
        items.push(...page.Items);
      }
    } catch {
      items.push(...result.Items);
    }
    return ok({ candidates: items });
  } catch (e) {
    return error(`unexpected error\n${e}`);
  }
}

export async function submit(event: Event, context: Context) {
  const requestBody = JSON.parse(event.body);
  const { fullname, email, experience } = requestBody;

  if (
    typeof fullname !== "string" ||
    typeof email !== "string" ||
    typeof experience !== "number"
  ) {
    return error("invalid input", 422);
  }

  const now = new Date().getTime();
  const candidate = {
    id: uuid(),
    fullname,
    email,
    experience,
    submittedAt: now,
    updatedAt: now
  };

  try {
    await client.putItem({ TableName, Item: candidate });
  } catch (e) {
    // FIXME Why would this fail? add finer error handling.
    return error(`Unable to submit candidate with email ${email}\n${e}`);
  }
  return ok({
    message: `Sucessfully submitted candidate with email ${email}`,
    candidateId: candidate.id
  });
}
