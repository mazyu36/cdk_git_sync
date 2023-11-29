import { Stack, StackProps, aws_iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

const GITHUB_OWNER = 'mazyu36';
const GITHUB_REPO = 'cdk_git_sync';

export class CdkPublishGhOidcStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const accountId = Stack.of(this).account;
    const region = Stack.of(this).region;

    const gitHubOidcProvider = new aws_iam.OpenIdConnectProvider(
      this,
      'GitHubOidcProvider',
      {
        url: 'https://token.actions.githubusercontent.com',
        clientIds: ['sts.amazonaws.com'],
      }
    );

    const gitHubOidcRole = new aws_iam.Role(this, 'GitHubOidcRole', {
      roleName: 'GitHubOidcRole',
      assumedBy: new aws_iam.FederatedPrincipal(
        gitHubOidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            'token.actions.githubusercontent.com:sub':
              `repo:${GITHUB_OWNER}/${GITHUB_REPO}:pull_request`,

          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    const cdkPublishPolicy = new aws_iam.Policy(this, 'CdkPublishPolicy', {
      policyName: 'CdkPublishPolicy',
      statements: [
        new aws_iam.PolicyStatement({
          effect: aws_iam.Effect.ALLOW,
          actions: ['sts:AssumeRole'],
          resources: [
            // `arn:aws:iam::${accountId}:role/cdk-hnb659fds-deploy-role-${accountId}-${region}`,
            `arn:aws:iam::${accountId}:role/cdk-hnb659fds-file-publishing-role-${accountId}-${region}`,
            `arn:aws:iam::${accountId}:role/cdk-hnb659fds-image-publishing-role-${accountId}-${region}`,
            `arn:aws:iam::${accountId}:role/cdk-hnb659fds-lookup-role-${accountId}-${region}`,
          ],
        }),
      ],
    });

    gitHubOidcRole.attachInlinePolicy(cdkPublishPolicy);
  }
}