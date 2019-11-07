import { handler } from "./hello.ts";
import { lambda } from "./mod.ts";

lambda.handler = handler;
