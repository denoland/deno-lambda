#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ExampleAwsCdkStack } from '../cdk/example-aws-cdk-stack';

const app = new cdk.App();
new ExampleAwsCdkStack(app, 'ExampleAwsCdkStack');
