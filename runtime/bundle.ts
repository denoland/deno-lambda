import { handler } from "./hello.ts";
import { lambda } from "./runtime.ts";

lambda.handler = handler;
