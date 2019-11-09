import { handler } from "./hello.ts";
import { lambda } from "https://deno.land/x/lambda/runtime.ts";

lambda.handler = handler;
