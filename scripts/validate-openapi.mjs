import SwaggerParser from "@apidevtools/swagger-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const spec = path.join(root, "specs/001-personal-todo-app/contracts/openapi.yaml");

await SwaggerParser.validate(spec);
console.log("OpenAPI OK:", spec);
