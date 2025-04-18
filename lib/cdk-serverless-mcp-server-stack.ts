import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {LayerVersion} from "aws-cdk-lib/aws-lambda";

export class CdkServerlessMcpServerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props); // Initialize the stack

        // Define runtime
        const runtime = lambda.Runtime.NODEJS_22_X

        // Create dependencies lambda layer
        const dependenciesLayerName = 'dependencies-layer'; // Name of the layer
        const dependenciesLayerFolder = 'layer/dependencies'; // Folder containing the layer code
        const dependenciesLayerDesc = 'Layer containing project dependencies'; // Description of the layer
        const dependenciesLayerProps = {
            code: lambda.Code.fromAsset(dependenciesLayerFolder), // Path to the layer code
            compatibleRuntimes: [ runtime], // Specify the compatible runtimes
            description: dependenciesLayerDesc, // Description of the layer
        };
        const dependenciesLayer = new LayerVersion(this, dependenciesLayerName, dependenciesLayerProps);

        // Create lambda function
        const mcpLambda = new lambda.Function(this, 'McpHandler', {
            runtime: runtime, // The runtime environment for the Lambda function
            handler: 'index.handler', // The name of the exported function in our code
            code: lambda.Code.fromAsset('src'), // Path to our lambda function code
            timeout: Duration.seconds(29), // Set timeout to 29 seconds
            layers: [dependenciesLayer] // Add the layer to the lambda function
        });

        // Create API Gateway
        const api = new apigateway.RestApi(this, 'McpApi', {
            restApiName: 'MCP Service', // The name of the API
        });

        // Add a resource and method to the API Gateway
        const mcpResource = api.root.addResource('mcp'); // Create a resource named 'mcp'
        mcpResource.addMethod('POST', new apigateway.LambdaIntegration(mcpLambda)); // Add a POST method to the resource
    }
}
