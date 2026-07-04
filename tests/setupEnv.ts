/// <reference types="node" />

import { loadEnvConfig } from "@next/env";

process.env.NODE_ENV = "test";
loadEnvConfig(process.cwd());
