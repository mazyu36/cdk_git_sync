import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import * as path from 'path';

export class CdkGitSyncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'CdkGitTestQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    // Lambda functionを追加
    new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'function.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
    })
  }
}
