#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkGitSyncStack } from '../lib/cdk_git_sync-stack';
import { CdkPublishGhOidcStack } from '../lib/oidc-stack';

const app = new cdk.App();
new CdkGitSyncStack(app, 'CdkGitSyncStack', {
  stackName: 'CdkGitSyncStack'
});

new CdkPublishGhOidcStack(app, 'CdkPublishGhOidcStack', {})