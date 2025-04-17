import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {LayerVersion} from "aws-cdk-lib/aws-lambda";

export class CdkServerlessMcpServerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Define runtime
        const runtime = lambda.Runtime.NODEJS_22_X

        // Create dependencies lambda layer
        const dependenciesLayerName = 'dependencies-layer';
        const dependenciesLayerFolder = 'layer/dependencies';
        const dependenciesLayerDesc = 'Layer containing project dependencies';
        const dependenciesLayerProps = {
            code: lambda.Code.fromAsset(dependenciesLayerFolder),
            compatibleRuntimes: [ runtime],
            description: dependenciesLayerDesc,
        };
        const dependenciesLayer = new LayerVersion(this, dependenciesLayerName, dependenciesLayerProps);

        // Create lambda function
        const mcpLambda = new lambda.Function(this, 'McpHandler', {
            runtime: runtime,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('src'),
            timeout: Duration.seconds(29),
            layers: [dependenciesLayer]
        });

        // Create API Gateway
        const api = new apigateway.RestApi(this, 'McpApi', {
            restApiName: 'MCP Service',
        });

        // Add a resource and method to the API Gateway
        const mcpResource = api.root.addResource('mcp');
        mcpResource.addMethod('POST', new apigateway.LambdaIntegration(mcpLambda));
    }
}
