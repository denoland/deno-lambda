import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import { CfnApplication } from "@aws-cdk/aws-sam";

export class ExampleAwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const denoRuntime = new CfnApplication(this, "DenoRuntime", {
      location: {
        applicationId:
          "arn:aws:serverlessrepo:us-east-1:390065572566:applications/deno",
        semanticVersion: "1.20.1",
      },
    });

    // Deno Layer
    const layer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "denoRuntimeLayer",
      denoRuntime.getAtt("Outputs.LayerArn").toString(),
    );

    const name = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.PROVIDED_AL2,
      code: lambda.Code.fromAsset("src"),
      handler: "hello.handler",
      layers: [layer],
    });

    // API Gateway
    new apigw.LambdaRestApi(this, "Endpoint", {
      handler: name,
    });
  }
}
