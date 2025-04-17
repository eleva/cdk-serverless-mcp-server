#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkServerlessMcpServerStack } from '../lib/cdk-serverless-mcp-server-stack';

const app = new cdk.App();
new CdkServerlessMcpServerStack(app, 'CdkServerlessMcpServerStack');
