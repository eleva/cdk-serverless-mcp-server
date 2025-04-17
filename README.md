# 🧠 serverless-mcp-server
A super simple Model Context Protocol (MCP) server deployed on AWS Lambda and exposed via Amazon API Gateway, deployed with AWS CDK.
This skeleton is based on the awesome work of [Frédéric Barthelet](https://github.com/fredericbarthelet): which has developed a middy middleware for Model Context Protocol (MCP) server integration with AWS Lambda functions in [this repo](https://github.com/fredericbarthelet/middy-mcp)

## 🛠 Features
- 🪄 Minimal MCP server setup using @modelcontextprotocol/sdk
- 🚀 Deployed as a single AWS Lambda function
- 🌐 HTTP POST endpoint exposed via API Gateway at /mcp
- 🔄 Supports local development testing with jest
- 🧪 Includes a simple example tool (add) with JSON-RPC interaction

## 📦 Project Structure
```
cdk-serverless-mcp-server/
├── __tests__/                              # Jest tests
├── bin/                                    # CDK entry point
├── cdk-serverless-mcp-server.ts                # CDK config
├── lib/                                    # CDK stack
│   └── cdk-serverless-mcp-server-stack.ts      # CDK stack
├── src/                                    # Source code
│   └── index.js                                # MCP server handler
├── .gitignore                              # Git ignore file
├── package.json                            # Project dependencies
├── package-lock.json                       # Project lock file
├── README.md                               # This documentation file
```

## 🛠 Prerequisites
- Node.js v22+
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) v2+

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Install AWS CDK globally (if not already installed):
```bash
npm install -g aws-cdk
```

3. Test Locally with jest
```bash
npm run test
```

## 🧬 Code Breakdown
This code is based on the awesome work of [Frédéric Barthelet](https://github.com/fredericbarthelet): which has developed a middy middleware for Model Context Protocol (MCP) server integration with AWS Lambda functions in [this repo](https://github.com/fredericbarthelet/middy-mcp)

### src/index.js
```javascript
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import mcpMiddleware from "middy-mcp";

const server = new McpServer({
  name: "Lambda hosted MCP Server",
  version: "1.0.0",
});

server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

export const handler = middy()
  .use(mcpMiddleware({ server }))
  .use(httpErrorHandler());
```

## 📡 Deploy to AWS

Just run:

```bash
npm run layer-dependencies-install # install dependencies for the layer
```

Then, deploy the stack:
```bash
cdk bootstrap
cdk deploy
```
After deployment, the MCP server will be live at the URL output by the command.

## 🧪 Once deployed, test with curl requests

### List tools
```bash
curl --location 'http://your-endpoint/dev/mcp' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--header 'jsonrpc: 2.0' \
--data '{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}'
```

### ➕ Use the add Tool
```bash
curl --location 'http://your-endpoint/dev/mcp' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--header 'jsonrpc: 2.0' \
--data '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "add",
    "arguments": {
      "a": 5,
      "b": 3
    }
  }
}'
```

## 📘 License
MIT — feel free to fork, tweak, and deploy your own version!

