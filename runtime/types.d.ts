// deno-lint-ignore-file
// Type definitions for AWS Lambda 8.10
// Project: http://docs.aws.amazon.com/lambda
// Definitions by: James Darbyshire <https://github.com/darbio>
//                 Michael Skarum <https://github.com/skarum>
//                 Stef Heyenrath <https://github.com/StefH>
//                 Rich Buggy <https://github.com/buggy>
//                 Yoriki Yamaguchi <https://github.com/y13i>
//                 wwwy3y3 <https://github.com/wwwy3y3>
//                 Ishaan Malhi <https://github.com/OrthoDex>
//                 Michael Marner <https://github.com/MichaelMarner>
//                 Daniel Cottone <https://github.com/daniel-cottone>
//                 Kostya Misura <https://github.com/kostya-misura>
//                 Markus Tacker <https://github.com/coderbyheart>
//                 Palmi Valgeirsson <https://github.com/palmithor>
//                 Danilo Raisi <https://github.com/daniloraisi>
//                 Simon Buchan <https://github.com/simonbuchan>
//                 David Hayden <https://github.com/Haydabase>
//                 Chris Redekop <https://github.com/repl-chris>
//                 Aneil Mallavarapu <https://github.com/aneilbaboo>
//                 Jeremy Nagel <https://github.com/jeznag>
//                 Louis Larry <https://github.com/louislarry>
//                 Daniel Papukchiev <https://github.com/dpapukchiev>
//                 Oliver Hookins <https://github.com/ohookins>
//                 Trevor Leach <https://github.com/trevor-leach>
//                 James Gregory <https://github.com/jagregory>
//                 Erik Dalén <https://github.com/dalen>
//                 Loïk Gaonac'h <https://github.com/loikg>
//                 Roberto Zen <https://github.com/skyzenr>
//                 Grzegorz Redlicki <https://github.com/redlickigrzegorz>
//                 Juan Carbonel <https://github.com/juancarbonel>
//                 Peter McIntyre <https://github.com/pwmcintyre>
//                 Alex Bolenok <https://github.com/alex-bolenok-centralreach>
//                 Marian Zange <https://github.com/marianzange>
//                 Alexander Pepper <https://github.com/apepper>
//                 Alessandro Palumbo <https://github.com/apalumbo>
//                 Sachin Shekhar <https://github.com/SachinShekhar>
//                 Ivan Martos <https://github.com/ivanmartos>
//                 Zach Anthony <https://github.com/zach-anthony>
//                 Peter Savnik <https://github.com/savnik>
//                 Sven Milewski <https://github.com/svenmilewski>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/**
 * The interface that AWS Lambda will invoke your handler with.
 * There are more specialized types for many cases where AWS services
 * invoke your lambda, but you can directly use this type for when you are invoking
 * your lambda directly.
 *
 * See tme {@link http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html AWS documentation}
 * for more information about the runtime behavior, and the
 * {@link https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/ AWS Blog post}
 * introducing the async handler behavior in the 8.10 runtime.
 *
 * @example <caption>Defining a custom handler type</caption>
 * import { Handler } from 'aws-lambda'
 *
 * interface NameEvent {
 *     fullName: string
 * }
 * interface NameResult {
 *     firstName: string
 *     middleNames: string
 *     lastName: string
 * }
 * type PersonHandler = Handler<NameEvent, NameResult>
 *
 * export const handler: PersonHandler = async (event) => {
 *   const names = event.fullName.split(' ')
 *   const firstName = names.shift()
 *   const lastName = names.pop()
 *   return { firstName, middleNames: names, lastName }
 * }
 *
 * @example <caption>Logs the contents of the event object and returns the location of the logs</caption>
 * import { Handler } from 'aws-lambda'
 *
 * export const handler: Handler = async (event, context) => {
 *   console.log("EVENT: \n" + JSON.stringify(event, null, 2))
 *   return context.logStreamName
 * }
 *
 * @example <caption>AWS SDK with Async Function and Promises</caption>
 * import { Handler } from 'aws-lambda'
 * import AWS from 'aws-sdk'
 *
 * const s3 = new AWS.S3()
 *
 * export const handler: Handler = async (event) => {
 *   const response = await s3.listBuckets().promise()
 *   return response?.Buckets.map((bucket) => bucket.Name)
 * }
 *
 * @example <caption>HTTP Request with Callback</caption>
 * import { Handler } from 'aws-lambda'
 * import https from 'https'
 *
 * let url = "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"
 *
 * export const handler: Handler<void, number> = (event, context, callback) => {
 *  https.get(url, (res) => {
 *    callback(null, res.statusCode)
 *  }).on('error', (e) => {
 *    callback(Error(e))
 *  })
 * }
 *
 * @param event
 *      Parsed JSON data in the lambda request payload. For an AWS service triggered
 *      lambda this should be in the format of a type ending in Event, for example the
 *      S3Handler receives an event of type S3Event.
 * @param context
 *      Runtime contextual information of the current invocation, for example the caller
 *      identity, available memory and time remaining, legacy completion callbacks, and
 *      a mutable property controlling when the lambda execution completes.
 * @param callback
 *      NodeJS-style completion callback that the AWS Lambda runtime will provide that can
 *      be used to provide the lambda result payload value, or any execution error. Can
 *      instead return a promise that resolves with the result payload value or rejects
 *      with the execution error.
 * @return
 *      A promise that resolves with the lambda result payload value, or rejects with the
 *      execution error. Note that if you implement your handler as an async function,
 *      you will automatically return a promise that will resolve with a returned value,
 *      or reject with a thrown value.
 */
export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>;

/**
 * {@link Handler} context parameter.
 * See {@link https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html AWS documentation}.
 */
export interface Context {
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  awsRequestId: string;
  logGroupName: string;
  logStreamName: string;
  identity?: CognitoIdentity;
  clientContext?: ClientContext;

  getRemainingTimeInMillis(): number;

  // Functions for compatibility with earlier Node.js Runtime v0.10.42
  // No longer documented, so they are deprecated, but they still work
  // as of the 12.x runtime, so they are not removed from the types.

  /** @deprecated Use handler callback or promise result */
  done(error?: Error, result?: any): void;
  /** @deprecated Use handler callback with first argument or reject a promise result */
  fail(error: Error | string): void;
  /** @deprecated Use handler callback with second argument or resolve a promise result */
  succeed(messageOrObject: any): void;
  // Unclear what behavior this is supposed to have, I couldn't find any still extant reference,
  // and it behaves like the above, ignoring the object parameter.
  /** @deprecated Use handler callback or promise result */
  succeed(message: string, object: any): void;
}

export interface CognitoIdentity {
  cognitoIdentityId: string;
  cognitoIdentityPoolId: string;
}

export interface ClientContext {
  client: ClientContextClient;
  Custom?: any;
  env: ClientContextEnv;
}

export interface ClientContextClient {
  installationId: string;
  appTitle: string;
  appVersionName: string;
  appVersionCode: string;
  appPackageName: string;
}

export interface ClientContextEnv {
  platformVersion: string;
  platform: string;
  make: string;
  model: string;
  locale: string;
}

// Poorly documented, but API Gateway will just fail internally if
// the context type does not match this.
// Note that although non-string types will be accepted, they will be
// coerced to strings on the other side.
export interface APIGatewayAuthorizerResultContext {
  [name: string]: string | number | boolean | null | undefined;
}

// Default authorizer type, prefer using a specific type with the "...WithAuthorizer..." variant types.
// Note that this doesn't have to be a context from a custom lambda outhorizer, AWS also has a cognito
// authorizer type and could add more, so the property won't always be a string.
export type APIGatewayEventDefaultAuthorizerContext = undefined | null | {
  [name: string]: any;
};

export type APIGatewayEventRequestContext =
  APIGatewayEventRequestContextWithAuthorizer<
    APIGatewayEventDefaultAuthorizerContext
  >;

// The requestContext property of both request authorizer and proxy integration events.
export interface APIGatewayEventRequestContextWithAuthorizer<
  TAuthorizerContext,
> {
  accountId: string;
  apiId: string;
  // This one is a bit confusing: it is not actually present in authorizer calls
  // and proxy calls without an authorizer. We model this by allowing undefined in the type,
  // since it ends up the same and avoids breaking users that are testing the property.
  // This lets us allow parameterizing the authorizer for proxy events that know what authorizer
  // context values they have.
  authorizer: TAuthorizerContext;
  connectedAt?: number;
  connectionId?: string;
  domainName?: string;
  domainPrefix?: string;
  eventType?: string;
  extendedRequestId?: string;
  protocol: string;
  httpMethod: string;
  identity: APIGatewayEventIdentity;
  messageDirection?: string;
  messageId?: string | null;
  path: string;
  stage: string;
  requestId: string;
  requestTime?: string;
  requestTimeEpoch: number;
  resourceId: string;
  resourcePath: string;
  routeKey?: string;
}

export interface APIGatewayEventIdentity {
  accessKey: string | null;
  accountId: string | null;
  apiKey: string | null;
  apiKeyId: string | null;
  caller: string | null;
  cognitoAuthenticationProvider: string | null;
  cognitoAuthenticationType: string | null;
  cognitoIdentityId: string | null;
  cognitoIdentityPoolId: string | null;
  principalOrgId: string | null;
  sourceIp: string;
  user: string | null;
  userAgent: string | null;
  userArn: string | null;
}
/**
 * CloudFront events
 * http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
 * Bear in mind that the "example" event structure in the page above includes
 * both an S3 and a Custom origin, which is not strictly allowed. Only one
 * of these per event may be present.
 */
export interface CloudFrontHeaders {
  [name: string]: Array<{
    key?: string;
    value: string;
  }>;
}

export type CloudFrontOrigin =
  | { s3: CloudFrontS3Origin; custom?: never }
  | { custom: CloudFrontCustomOrigin; s3?: never };

export interface CloudFrontCustomOrigin {
  customHeaders: CloudFrontHeaders;
  domainName: string;
  keepaliveTimeout: number;
  path: string;
  port: number;
  protocol: "http" | "https";
  readTimeout: number;
  sslProtocols: string[];
}

export interface CloudFrontS3Origin {
  authMethod: "origin-access-identity" | "none";
  customHeaders: CloudFrontHeaders;
  domainName: string;
  path: string;
  region: string;
}

export interface CloudFrontResponse {
  status: string;
  statusDescription: string;
  headers: CloudFrontHeaders;
}

export interface CloudFrontRequest {
  body?: {
    action: "read-only" | "replace";
    data: string;
    encoding: "base64" | "text";
    readonly inputTruncated: boolean;
  };
  readonly clientIp: string;
  readonly method: string;
  uri: string;
  querystring: string;
  headers: CloudFrontHeaders;
  origin?: CloudFrontOrigin;
}

export interface CloudFrontEvent {
  config: {
    readonly distributionDomainName: string;
    readonly distributionId: string;
    readonly eventType:
      | "origin-request"
      | "origin-response"
      | "viewer-request"
      | "viewer-response";
    readonly requestId: string;
  };
}

/**
 * Generated HTTP response in viewer request event or origin request event
 *
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-generating-http-responses-in-requests.html#lambda-generating-http-responses-object
 */
export interface CloudFrontResultResponse {
  status: string;
  statusDescription?: string;
  headers?: CloudFrontHeaders;
  bodyEncoding?: "text" | "base64";
  body?: string;
}

export type ALBHandler = Handler<ALBEvent, ALBResult>;

// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/lambda-functions.html
export interface ALBEventRequestContext {
  elb: {
    targetGroupArn: string;
  };
}

export interface ALBEventQueryStringParameters {
  [name: string]: string | undefined;
}

export interface ALBEventHeaders {
  [name: string]: string | undefined;
}

export interface ALBEventMultiValueHeaders {
  [name: string]: string[] | undefined;
}

export interface ALBEventMultiValueQueryStringParameters {
  [name: string]: string[] | undefined;
}

export interface ALBEvent {
  requestContext: ALBEventRequestContext;
  httpMethod: string;
  path: string;
  queryStringParameters?: ALBEventQueryStringParameters; // URL encoded
  headers?: ALBEventHeaders;
  multiValueQueryStringParameters?: ALBEventMultiValueQueryStringParameters; // URL encoded
  multiValueHeaders?: ALBEventMultiValueHeaders;
  body: string | null;
  isBase64Encoded: boolean;
}

export interface ALBResult {
  statusCode: number;
  statusDescription?: string;
  headers?: { [header: string]: boolean | number | string };
  multiValueHeaders?: { [header: string]: Array<boolean | number | string> };
  body?: string;
  isBase64Encoded?: boolean;
}

export type APIGatewayAuthorizerHandler = Handler<
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult
>;
export type APIGatewayAuthorizerWithContextHandler<
  TAuthorizerContext extends APIGatewayAuthorizerResultContext,
> = Handler<
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerWithContextResult<TAuthorizerContext>
>;

export type APIGatewayTokenAuthorizerHandler = Handler<
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
>;
export type APIGatewayTokenAuthorizerWithContextHandler<
  TAuthorizerContext extends APIGatewayAuthorizerResultContext,
> = Handler<
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerWithContextResult<TAuthorizerContext>
>;

export type APIGatewayRequestAuthorizerHandler = Handler<
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerResult
>;
export type APIGatewayRequestAuthorizerWithContextHandler<
  TAuthorizerContext extends APIGatewayAuthorizerResultContext,
> = Handler<
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerWithContextResult<TAuthorizerContext>
>;

export type APIGatewayAuthorizerEvent =
  | APIGatewayTokenAuthorizerEvent
  | APIGatewayRequestAuthorizerEvent;

export interface APIGatewayTokenAuthorizerEvent {
  type: "TOKEN";
  methodArn: string;
  authorizationToken: string;
}

export interface APIGatewayRequestAuthorizerEventHeaders {
  [name: string]: string | undefined;
}

export interface APIGatewayRequestAuthorizerEventMultiValueHeaders {
  [name: string]: string[] | undefined;
}

export interface APIGatewayRequestAuthorizerEventPathParameters {
  [name: string]: string | undefined;
}

export interface APIGatewayRequestAuthorizerEventQueryStringParameters {
  [name: string]: string | undefined;
}

export interface APIGatewayRequestAuthorizerEventMultiValueQueryStringParameters {
  [name: string]: string[] | undefined;
}

export interface APIGatewayRequestAuthorizerEventStageVariables {
  [name: string]: string | undefined;
}

// Note, when invoked by the tester in the AWS web console, the map values can be null,
// but they will be empty objects in the real object.
// Worse, it will include "body" and "isBase64Encoded" properties, unlike the real call!
// See https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html for the
// formal definition.
export interface APIGatewayRequestAuthorizerEvent {
  type: "REQUEST";
  methodArn: string;
  resource: string;
  path: string;
  httpMethod: string;
  headers: APIGatewayRequestAuthorizerEventHeaders | null;
  multiValueHeaders: APIGatewayRequestAuthorizerEventMultiValueHeaders | null;
  pathParameters: APIGatewayRequestAuthorizerEventPathParameters | null;
  queryStringParameters:
    | APIGatewayRequestAuthorizerEventQueryStringParameters
    | null;
  multiValueQueryStringParameters:
    | APIGatewayRequestAuthorizerEventMultiValueQueryStringParameters
    | null;
  stageVariables: APIGatewayRequestAuthorizerEventStageVariables | null;
  requestContext: APIGatewayEventRequestContextWithAuthorizer<undefined>;
}

export interface APIGatewayAuthorizerResult {
  principalId: string;
  policyDocument: PolicyDocument;
  context?: APIGatewayAuthorizerResultContext | null;
  usageIdentifierKey?: string | null;
}

// Separate type so the context property is required, without pulling complex type magic.
export interface APIGatewayAuthorizerWithContextResult<
  TAuthorizerContext extends APIGatewayAuthorizerResultContext,
> {
  principalId: string;
  policyDocument: PolicyDocument;
  context: TAuthorizerContext;
  usageIdentifierKey?: string | null;
}

/** @deprecated Use APIGatewayAuthorizerHandler or a subtype */
export type CustomAuthorizerHandler = Handler<
  CustomAuthorizerEvent,
  APIGatewayAuthorizerResult
>;

/** @deprecated Use APIGatewayAuthorizerEvent or a subtype */
export interface CustomAuthorizerEvent {
  type: string;
  methodArn: string;
  authorizationToken?: string;
  resource?: string;
  path?: string;
  httpMethod?: string;
  headers?: { [name: string]: string };
  multiValueHeaders?: { [name: string]: string[] };
  pathParameters?: { [name: string]: string } | null;
  queryStringParameters?: { [name: string]: string } | null;
  multiValueQueryStringParameters?: { [name: string]: string[] } | null;
  stageVariables?: { [name: string]: string };
  requestContext?: APIGatewayEventRequestContextWithAuthorizer<
    APIGatewayEventDefaultAuthorizerContext
  >;
  domainName?: string;
  apiId?: string;
}

export type CustomAuthorizerResult = APIGatewayAuthorizerResult;
export type AuthResponse = APIGatewayAuthorizerResult;
export type AuthResponseContext = APIGatewayAuthorizerResultContext;

/**
 * API Gateway CustomAuthorizer AuthResponse.PolicyDocument.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
 */
export interface PolicyDocument {
  Version: string;
  Id?: string;
  Statement: Statement[];
}

/**
 * API Gateway CustomAuthorizer AuthResponse.PolicyDocument.Condition.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-policy-language-overview.html
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html
 */
export interface ConditionBlock {
  [condition: string]: Condition | Condition[];
}

export interface Condition {
  [key: string]: string | string[];
}

/**
 * API Gateway CustomAuthorizer AuthResponse.PolicyDocument.Statement.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-policy-language-overview.html
 * https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html
 */
export type Statement =
  & BaseStatement
  & StatementAction
  & (StatementResource | StatementPrincipal);

export interface BaseStatement {
  Effect: string;
  Sid?: string;
  Condition?: ConditionBlock;
}

export type PrincipalValue =
  | { [key: string]: string | string[] }
  | string
  | string[];
export interface MaybeStatementPrincipal {
  Principal?: PrincipalValue;
  NotPrincipal?: PrincipalValue;
}
export interface MaybeStatementResource {
  Resource?: string | string[];
  NotResource?: string | string[];
}
export type StatementAction = { Action: string | string[] } | {
  NotAction: string | string[];
};
export type StatementResource =
  & MaybeStatementPrincipal
  & ({ Resource: string | string[] } | { NotResource: string | string[] });
export type StatementPrincipal =
  & MaybeStatementResource
  & ({ Principal: PrincipalValue } | { NotPrincipal: PrincipalValue });

/**
 * Works with Lambda Proxy Integration for Rest API or HTTP API integration Payload Format version 1.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export type APIGatewayProxyHandler = Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>;
/**
 * Works with Lambda Proxy Integration for Rest API or HTTP API integration Payload Format version 1.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */

/**
 * Works with HTTP API integration Payload Format version 2.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export type APIGatewayProxyHandlerV2<T = never> = Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2<T>
>;
/**
 * Works with HTTP API integration Payload Format version 2.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */

/**
 * Works with Lambda Proxy Integration for Rest API or HTTP API integration Payload Format version 1.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export type APIGatewayProxyEvent = APIGatewayProxyEventBase<
  APIGatewayEventDefaultAuthorizerContext
>;

export type APIGatewayProxyWithLambdaAuthorizerHandler<TAuthorizerContext> =
  Handler<
    APIGatewayProxyWithLambdaAuthorizerEvent<TAuthorizerContext>,
    APIGatewayProxyResult
  >;

export type APIGatewayProxyWithCognitoAuthorizerHandler = Handler<
  APIGatewayProxyWithCognitoAuthorizerEvent,
  APIGatewayProxyResult
>;

export type APIGatewayProxyWithLambdaAuthorizerEvent<TAuthorizerContext> =
  APIGatewayProxyEventBase<
    APIGatewayEventLambdaAuthorizerContext<TAuthorizerContext>
  >;

export type APIGatewayProxyWithLambdaAuthorizerEventRequestContext<
  TAuthorizerContext,
> = APIGatewayEventRequestContextWithAuthorizer<
  APIGatewayEventLambdaAuthorizerContext<TAuthorizerContext>
>;

// API Gateway proxy integration mangles the context from a custom authorizer,
// converting all number or boolean properties to string, and adding some extra properties.
export type APIGatewayEventLambdaAuthorizerContext<TAuthorizerContext> =
  & {
    [P in keyof TAuthorizerContext]: TAuthorizerContext[P] extends null ? null
      : string;
  }
  & {
    principalId: string;
    integrationLatency: number;
  };

export type APIGatewayProxyWithCognitoAuthorizerEvent =
  APIGatewayProxyEventBase<APIGatewayProxyCognitoAuthorizer>;

// All claims are coerced into strings.
export interface APIGatewayProxyCognitoAuthorizer {
  claims: {
    [name: string]: string;
  };
}

export interface APIGatewayProxyEventHeaders {
  [name: string]: string | undefined;
}

export interface APIGatewayProxyEventMultiValueHeaders {
  [name: string]: string[] | undefined;
}

export interface APIGatewayProxyEventPathParameters {
  [name: string]: string | undefined;
}

export interface APIGatewayProxyEventQueryStringParameters {
  [name: string]: string | undefined;
}

export interface APIGatewayProxyEventMultiValueQueryStringParameters {
  [name: string]: string[] | undefined;
}

export interface APIGatewayProxyEventStageVariables {
  [name: string]: string | undefined;
}

export interface APIGatewayProxyEventBase<TAuthorizerContext> {
  body: string | null;
  headers: APIGatewayProxyEventHeaders;
  multiValueHeaders: APIGatewayProxyEventMultiValueHeaders;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: APIGatewayProxyEventPathParameters | null;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
  multiValueQueryStringParameters:
    | APIGatewayProxyEventMultiValueQueryStringParameters
    | null;
  stageVariables: APIGatewayProxyEventStageVariables | null;
  requestContext: APIGatewayEventRequestContextWithAuthorizer<
    TAuthorizerContext
  >;
  resource: string;
}

/**
 * Works with Lambda Proxy Integration for Rest API or HTTP API integration Payload Format version 1.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export interface APIGatewayProxyResult {
  statusCode: number;
  headers?: {
    [header: string]: boolean | number | string;
  };
  multiValueHeaders?: {
    [header: string]: Array<boolean | number | string>;
  };
  body: string;
  isBase64Encoded?: boolean;
}

/**
 * Works with HTTP API integration Payload Format version 2.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export interface APIGatewayProxyEventV2 {
  version: string;
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  cookies?: string[];
  headers: APIGatewayProxyEventHeaders;
  queryStringParameters?: APIGatewayProxyEventQueryStringParameters;
  requestContext: {
    accountId: string;
    apiId: string;
    authorizer?: {
      jwt: {
        claims: { [name: string]: string | number | boolean | string[] };
        scopes: string[];
      };
    };
    domainName: string;
    domainPrefix: string;
    http: {
      method: string;
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
    };
    requestId: string;
    routeKey: string;
    stage: string;
    time: string;
    timeEpoch: number;
  };
  body?: string;
  pathParameters?: APIGatewayProxyEventPathParameters;
  isBase64Encoded: boolean;
  stageVariables?: APIGatewayProxyEventStageVariables;
}

/**
 * Works with HTTP API integration Payload Format version 2.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export type APIGatewayProxyResultV2<T = never> =
  | APIGatewayProxyStructuredResultV2
  | string
  | T;

/**
 * Interface for structured response with `statusCode` and`headers`
 * Works with HTTP API integration Payload Format version 2.0
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export interface APIGatewayProxyStructuredResultV2 {
  statusCode?: number;
  headers?: {
    [header: string]: boolean | number | string;
  };
  body?: string;
  isBase64Encoded?: boolean;
  cookies?: string[];
}

// Legacy names
export type ProxyHandler = APIGatewayProxyHandler;
export type APIGatewayEvent = APIGatewayProxyEvent;
export type ProxyResult = APIGatewayProxyResult;

export type AppSyncResolverHandler<T, V> = Handler<
  AppSyncResolverEvent<T>,
  V | V[]
>;

export interface AppSyncResolverEventHeaders {
  [name: string]: string | undefined;
}

/**
 * See https://docs.aws.amazon.com/appsync/latest/devguide/resolver-context-reference.html
 *
 * @param T type of the arguments
 */
export interface AppSyncResolverEvent<T> {
  arguments: T;
  identity?: AppSyncIdentityIAM | AppSyncIdentityCognito;
  source: { [key: string]: any } | null;
  request: {
    headers: AppSyncResolverEventHeaders;
  };
  info: {
    selectionSetList: string[];
    selectionSetGraphQL: string;
    parentTypeName: string;
    fieldName: string;
    variables: { [key: string]: any };
  };
  prev: { result: { [key: string]: any } } | null;
  stash: { [key: string]: any };
}

export interface AppSyncIdentityIAM {
  accountId: string;
  cognitoIdentityPoolId: string;
  cognitoIdentityId: string;
  sourceIp: string[];
  username: string;
  userArn: string;
  cognitoIdentityAuthType: string;
  cognitoIdentityAuthProvider: string;
}

export interface AppSyncIdentityCognito {
  sub: string;
  issuer: string;
  username: string;
  claims: any;
  sourceIp: string[];
  defaultAuthStrategy: string;
  groups: string[] | null;
}

// Note, responses are *not* lambda results, they are sent to the event ResponseURL.
export type CloudFormationCustomResourceHandler = Handler<
  CloudFormationCustomResourceEvent,
  void
>;

export type CloudFormationCustomResourceEvent =
  | CloudFormationCustomResourceCreateEvent
  | CloudFormationCustomResourceUpdateEvent
  | CloudFormationCustomResourceDeleteEvent;

export type CloudFormationCustomResourceResponse =
  | CloudFormationCustomResourceSuccessResponse
  | CloudFormationCustomResourceFailedResponse;

/**
 * CloudFormation Custom Resource event and response
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref.html
 */
export interface CloudFormationCustomResourceEventCommon {
  ServiceToken: string;
  ResponseURL: string;
  StackId: string;
  RequestId: string;
  LogicalResourceId: string;
  ResourceType: string;
  ResourceProperties: {
    ServiceToken: string;
    [Key: string]: any;
  };
}

export interface CloudFormationCustomResourceCreateEvent
  extends CloudFormationCustomResourceEventCommon {
  RequestType: "Create";
}

export interface CloudFormationCustomResourceUpdateEvent
  extends CloudFormationCustomResourceEventCommon {
  RequestType: "Update";
  PhysicalResourceId: string;
  OldResourceProperties: {
    [Key: string]: any;
  };
}

export interface CloudFormationCustomResourceDeleteEvent
  extends CloudFormationCustomResourceEventCommon {
  RequestType: "Delete";
  PhysicalResourceId: string;
}

export interface CloudFormationCustomResourceResponseCommon {
  PhysicalResourceId: string;
  StackId: string;
  RequestId: string;
  LogicalResourceId: string;
  Data?: {
    [Key: string]: any;
  };
  NoEcho?: boolean;
}

export interface CloudFormationCustomResourceSuccessResponse
  extends CloudFormationCustomResourceResponseCommon {
  Status: "SUCCESS";
  Reason?: string;
}

export interface CloudFormationCustomResourceFailedResponse
  extends CloudFormationCustomResourceResponseCommon {
  Status: "FAILED";
  Reason: string;
}

export type CloudFrontRequestHandler = Handler<
  CloudFrontRequestEvent,
  CloudFrontRequestResult
>;

/**
 * CloudFront viewer request or origin request event
 *
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#lambda-event-structure-request
 */
export interface CloudFrontRequestEvent {
  Records: Array<{
    cf: CloudFrontEvent & {
      request: CloudFrontRequest;
    };
  }>;
}

export type CloudFrontRequestResult =
  | undefined
  | null
  | CloudFrontResultResponse
  | CloudFrontRequest;

export type CloudFrontResponseHandler = Handler<
  CloudFrontResponseEvent,
  CloudFrontResponseResult
>;

/**
 * CloudFront viewer response or origin response event
 *
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#lambda-event-structure-response
 */
export interface CloudFrontResponseEvent {
  Records: Array<{
    cf: CloudFrontEvent & {
      readonly request: Pick<
        CloudFrontRequest,
        Exclude<keyof CloudFrontRequest, "body">
      >;
      response: CloudFrontResponse;
    };
  }>;
}

export type CloudFrontResponseResult =
  | undefined
  | null
  | CloudFrontResultResponse;

export type ScheduledHandler<TDetail = any> = EventBridgeHandler<
  "Scheduled Event",
  TDetail,
  void
>;

/**
 * https://docs.aws.amazon.com/lambda/latest/dg/with-scheduled-events.html
 */
export interface ScheduledEvent<TDetail = any>
  extends EventBridgeEvent<"Scheduled Event", TDetail> {}

export type CloudWatchLogsHandler = Handler<CloudWatchLogsEvent, void>;

/**
 * See http://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-cloudwatch-logs
 */
export interface CloudWatchLogsEvent {
  awslogs: CloudWatchLogsEventData;
}

export interface CloudWatchLogsEventData {
  data: string;
}

export interface CloudWatchLogsDecodedData {
  owner: string;
  logGroup: string;
  logStream: string;
  subscriptionFilters: string[];
  messageType: string;
  logEvents: CloudWatchLogsLogEvent[];
}

export interface CloudWatchLogsLogEventExtractedFields {
  [name: string]: string | undefined;
}

/**
 * See http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#LambdaFunctionExample
 */
export interface CloudWatchLogsLogEvent {
  id: string;
  timestamp: number;
  message: string;
  extractedFields?: CloudWatchLogsLogEventExtractedFields;
}

export type CodeBuildCloudWatchStateHandler = EventBridgeHandler<
  "CodeBuild Build State Change",
  CodeBuildStateEventDetail,
  void
>;

export type CodeBuildStateType =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "STOPPED";
export type CodeBuildPhaseType =
  | "COMPLETED"
  | "FINALIZING"
  | "UPLOAD_ARTIFACTS"
  | "POST_BUILD"
  | "BUILD"
  | "PRE_BUILD"
  | "INSTALL"
  | "QUEUED"
  | "DOWNLOAD_SOURCE"
  | "PROVISIONING"
  | "SUBMITTED";
export type CodeBuildPhaseStatusType =
  | "TIMED_OUT"
  | "STOPPED"
  | "FAILED"
  | "SUCCEEDED"
  | "FAULT"
  | "CLIENT_ERROR";
export type CodeBuildCacheType = "NO_CACHE" | "LOCAL" | "S3";
export type CodeBuildSourceLocationType =
  | "CODECOMMIT"
  | "CODEPIPELINE"
  | "GITHUB"
  | "GITHUB_ENTERPRISE"
  | "BITBUCKET"
  | "S3"
  | "NO_SOURCE";
export type CodeBuildEnvironmentType =
  | "LINUX_CONTAINER"
  | "LINUX_GPU_CONTAINER"
  | "WINDOWS_CONTAINER"
  | "ARM_CONTAINER";
export type CodeBuildEnvironmentPullCredentialsType =
  | "CODEBUILD"
  | "SERVICE_ROLE";
export type CodeBuildEnvironmentComputeType =
  | "BUILD_GENERAL1_SMALL"
  | "BUILD_GENERAL1_MEDIUM"
  | "BUILD_GENERAL1_LARGE"
  | "BUILD_GENERAL1_2XLARGE";
export type CodeBuildEnvironmentVariableType =
  | "PARAMETER_STORE"
  | "PLAINTEXT"
  | "SECRETS_MANAGER";

export interface CodeBuildStateEventDetail {
  "build-status": CodeBuildStateType;
  "project-name": string;
  "build-id": string;
  "current-phase": CodeBuildPhaseType;
  "current-phase-context": string;
  version: string;
  "additional-information": {
    cache: {
      type: CodeBuildCacheType;
    };
    "build-number": number;
    "timeout-in-minutes": number;
    "build-complete": boolean;
    initiator: string;
    "build-start-time": string;
    source: {
      buildspec: string;
      location: string;
      type: CodeBuildSourceLocationType;
    };
    "source-version": string;
    artifact: {
      location: string;
    };
    environment: {
      image: string;
      "privileged-mode": boolean;
      "image-pull-credentials-type"?: CodeBuildEnvironmentPullCredentialsType;
      "compute-type": CodeBuildEnvironmentComputeType;
      type: CodeBuildEnvironmentType;
      "environment-variables": Array<{
        name: string;
        type?: CodeBuildEnvironmentVariableType;
        value: string;
      }>;
    };
    "project-file-system-locations": [];
    logs: {
      "group-name": string;
      "stream-name": string;
      "deep-link": string;
    };
    phases: Array<{
      "phase-context"?: string[]; // Not available for COMPLETED phase-type
      "start-time": string;
      "end-time"?: string; // Not available for COMPLETED phase-type
      "duration-in-seconds"?: number; // Not available for COMPLETED phase-type
      "phase-type": CodeBuildPhaseType;
      "phase-status"?: CodeBuildPhaseStatusType; // Not available for COMPLETED phase-type
    }>;
    "queued-timeout-in-minutes": number;
  };
}

export interface CodeBuildCloudWatchStateEvent extends
  EventBridgeEvent<
    "CodeBuild Build State Change",
    CodeBuildStateEventDetail
  > {
  source: "aws.codebuild";
}

export type CodePipelineHandler = Handler<CodePipelineEvent, void>;

/**
 * CodePipeline events
 * https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html
 */
export interface S3ArtifactLocation {
  bucketName: string;
  objectKey: string;
}
export interface S3ArtifactStore {
  type: "S3";
  s3Location: S3ArtifactLocation;
}

export type ArtifactLocation = S3ArtifactStore;

export interface Artifact {
  name: string;
  revision: string | null;
  location: ArtifactLocation;
}

export interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export interface EncryptionKey {
  type: string;
  id: string;
}

export interface CodePipelineEvent {
  "CodePipeline.job": {
    id: string;
    accountId: string;
    data: {
      actionConfiguration: {
        configuration: {
          FunctionName: string;
          UserParameters: string;
        };
      };
      inputArtifacts: Artifact[];
      outputArtifacts: Artifact[];
      artifactCredentials: Credentials;
      encryptionKey?: EncryptionKey & { type: "KMS" };
      continuationToken?: string;
    };
  };
}

export type CodePipelineCloudWatchHandler = Handler<
  CodePipelineCloudWatchEvent,
  void
>;

export type CodePipelineCloudWatchEvent =
  | CodePipelineCloudWatchPipelineEvent
  | CodePipelineCloudWatchStageEvent
  | CodePipelineCloudWatchActionEvent;

export type CodePipelineCloudWatchActionHandler = Handler<
  CodePipelineCloudWatchActionEvent,
  void
>;

export type CodePipelineActionCategory =
  | "Approval"
  | "Build"
  | "Deploy"
  | "Invoke"
  | "Source"
  | "Test";
export type CodePipelineActionState =
  | "STARTED"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED";

export interface CodePipelineCloudWatchActionEvent {
  version: string;
  id: string;
  "detail-type": "CodePipeline Action Execution State Change";
  source: "aws.codepipeline";
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: {
    pipeline: string;
    version: number;
    "execution-id": string;
    stage: string;
    action: string;
    state: CodePipelineActionState;
    type: {
      owner: "AWS" | "Custom" | "ThirdParty";
      category: CodePipelineActionCategory;
      provider: string;
      version: number;
    };
  };
}

export type CodePipelineCloudWatchPipelineHandler = Handler<
  CodePipelineCloudWatchPipelineEvent,
  void
>;

export type CodePipelineState =
  | "STARTED"
  | "SUCCEEDED"
  | "RESUMED"
  | "FAILED"
  | "CANCELED"
  | "SUPERSEDED";

/**
 * CodePipeline CloudWatch Events
 * https://docs.aws.amazon.com/codepipeline/latest/userguide/detect-state-changes-cloudwatch-events.html
 *
 * The above CodePipelineEvent is when a lambda is invoked by a CodePipeline.
 * These events are when you subscribe to CodePipeline events in CloudWatch.
 *
 * Their documentation says that detail.version is a string, but it is actually an integer
 */

export interface CodePipelineCloudWatchPipelineEvent {
  version: string;
  id: string;
  "detail-type": "CodePipeline Pipeline Execution State Change";
  source: "aws.codepipeline";
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: {
    pipeline: string;
    version: number;
    state: CodePipelineState;
    "execution-id": string;
  };
}

export type CodePipelineCloudWatchStageHandler = Handler<
  CodePipelineCloudWatchStageEvent,
  void
>;

export type CodePipelineStageState =
  | "STARTED"
  | "SUCCEEDED"
  | "RESUMED"
  | "FAILED"
  | "CANCELED";

export interface CodePipelineCloudWatchStageEvent {
  version: string;
  id: string;
  "detail-type": "CodePipeline Stage Execution State Change";
  source: "aws.codepipeline";
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: {
    pipeline: string;
    version: number;
    "execution-id": string;
    stage: string;
    state: CodePipelineStageState;
  };
}

/**
 * Cognito User Pool event
 * @deprecated Please use specific event types instead
 * http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html
 */
export interface CognitoUserPoolTriggerEvent {
  version: number;
  triggerSource:
    | "PreSignUp_SignUp"
    | "PreSignUp_ExternalProvider"
    | "PostConfirmation_ConfirmSignUp"
    | "PreAuthentication_Authentication"
    | "PostAuthentication_Authentication"
    | "CustomMessage_SignUp"
    | "CustomMessage_AdminCreateUser"
    | "CustomMessage_ResendCode"
    | "CustomMessage_ForgotPassword"
    | "CustomMessage_UpdateUserAttribute"
    | "CustomMessage_VerifyUserAttribute"
    | "CustomMessage_Authentication"
    | "DefineAuthChallenge_Authentication"
    | "CreateAuthChallenge_Authentication"
    | "VerifyAuthChallengeResponse_Authentication"
    | "PreSignUp_AdminCreateUser"
    | "PostConfirmation_ConfirmForgotPassword"
    | "TokenGeneration_HostedAuth"
    | "TokenGeneration_Authentication"
    | "TokenGeneration_NewPasswordChallenge"
    | "TokenGeneration_AuthenticateDevice"
    | "TokenGeneration_RefreshTokens"
    | "UserMigration_Authentication"
    | "UserMigration_ForgotPassword";
  region: string;
  userPoolId: string;
  userName?: string;
  callerContext: {
    awsSdkVersion: string;
    clientId: string;
  };
  request: {
    userAttributes: { [key: string]: string };
    validationData?: { [key: string]: string };
    codeParameter?: string;
    linkParameter?: string;
    usernameParameter?: string;
    newDeviceUsed?: boolean;
    session?: Array<{
      challengeName:
        | "CUSTOM_CHALLENGE"
        | "PASSWORD_VERIFIER"
        | "SMS_MFA"
        | "DEVICE_SRP_AUTH"
        | "DEVICE_PASSWORD_VERIFIER"
        | "ADMIN_NO_SRP_AUTH"
        | "SRP_A";
      challengeResult: boolean;
      challengeMetadata?: string;
    }>;
    challengeName?: string;
    privateChallengeParameters?: { [key: string]: string };
    challengeAnswer?: string;
    password?: string;
    clientMetadata?: { [key: string]: string };
    userNotFound?: boolean;
  };
  response: {
    autoConfirmUser?: boolean;
    autoVerifyPhone?: boolean;
    autoVerifyEmail?: boolean;
    smsMessage?: string;
    emailMessage?: string;
    emailSubject?: string;
    challengeName?: string;
    issueTokens?: boolean;
    failAuthentication?: boolean;
    publicChallengeParameters?: { [key: string]: string };
    privateChallengeParameters?: { [key: string]: string };
    challengeMetadata?: string;
    answerCorrect?: boolean;
    userAttributes?: { [key: string]: string };
    finalUserStatus?: "CONFIRMED" | "RESET_REQUIRED";
    messageAction?: "SUPPRESS";
    desiredDeliveryMediums?: Array<"EMAIL" | "SMS">;
    forceAliasCreation?: boolean;
    claimsOverrideDetails?: {
      claimsToAddOrOverride?: { [key: string]: string };
      claimsToSuppress?: string[];
      groupOverrideDetails?: null | {
        groupsToOverride?: string[];
        iamRolesToOverride?: string[];
        preferredRole?: string;
      };
    };
  };
}

/**
 * @deprecated Please use specific event types instead
 */
export type CognitoUserPoolEvent = CognitoUserPoolTriggerEvent;

/**
 * @deprecated Please use specific event handler types instead
 */
export type CognitoUserPoolTriggerHandler = Handler<
  CognitoUserPoolTriggerEvent
>;

export * from "./create-auth-challenge";
export * from "./custom-message";
export * from "./custom-email-sender";
export * from "./define-auth-challenge";
export * from "./post-authentication";
export * from "./post-confirmation";
export * from "./pre-authentication";
export * from "./pre-signup";
export * from "./pre-token-generation";
export * from "./user-migration";
export * from "./verify-auth-challenge-response";

export type ConnectContactFlowHandler = Handler<
  ConnectContactFlowEvent,
  ConnectContactFlowResult
>;

// Connect
// https://docs.aws.amazon.com/connect/latest/adminguide/connect-lambda-functions.html
export interface ConnectContactFlowEvent {
  Details: {
    ContactData: {
      Attributes: { [key: string]: string };
      Channel: ConnectContactFlowChannel;
      ContactId: string;
      CustomerEndpoint: ConnectContactFlowEndpoint | null;
      InitialContactId: string;
      InitiationMethod: ConnectContactFlowInitiationMethod;
      InstanceARN: string;
      PreviousContactId: string;
      Queue: ConnectContactFlowQueue | null;
      SystemEndpoint: ConnectContactFlowEndpoint | null;
      MediaStreams: {
        Customer: {
          Audio: {
            StartFragmentNumber?: string;
            StartTimestamp?: string;
            StreamARN?: string;
          };
        };
      };
    };
    Parameters: { [key: string]: string };
  };
  Name: "ContactFlowEvent";
}

export type ConnectContactFlowChannel = "VOICE" | "CHAT";

export type ConnectContactFlowInitiationMethod =
  | "INBOUND"
  | "OUTBOUND"
  | "TRANSFER"
  | "CALLBACK"
  | "API";

export interface ConnectContactFlowEndpoint {
  Address: string;
  Type: "TELEPHONE_NUMBER";
}

export interface ConnectContactFlowQueue {
  ARN: string;
  Name: string;
}

export interface ConnectContactFlowResult {
  [key: string]: string | null;
}

export type DynamoDBStreamHandler = Handler<DynamoDBStreamEvent, void>;

// http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_AttributeValue.html
export interface AttributeValue {
  B?: string;
  BS?: string[];
  BOOL?: boolean;
  L?: AttributeValue[];
  M?: { [id: string]: AttributeValue };
  N?: string;
  NS?: string[];
  NULL?: boolean;
  S?: string;
  SS?: string[];
}

// http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_StreamRecord.html
export interface StreamRecord {
  ApproximateCreationDateTime?: number;
  Keys?: { [key: string]: AttributeValue };
  NewImage?: { [key: string]: AttributeValue };
  OldImage?: { [key: string]: AttributeValue };
  SequenceNumber?: string;
  SizeBytes?: number;
  StreamViewType?:
    | "KEYS_ONLY"
    | "NEW_IMAGE"
    | "OLD_IMAGE"
    | "NEW_AND_OLD_IMAGES";
}

// http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_Record.html
export interface DynamoDBRecord {
  awsRegion?: string;
  dynamodb?: StreamRecord;
  eventID?: string;
  eventName?: "INSERT" | "MODIFY" | "REMOVE";
  eventSource?: string;
  eventSourceARN?: string;
  eventVersion?: string;
  userIdentity?: any;
}

// http://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-ddb-update
export interface DynamoDBStreamEvent {
  Records: DynamoDBRecord[];
}

export type EventBridgeHandler<TDetailType extends string, TDetail, TResult> =
  Handler<
    EventBridgeEvent<TDetailType, TDetail>,
    TResult
  >;

export interface EventBridgeEvent<TDetailType extends string, TDetail> {
  id: string;
  version: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  source: string;
  "detail-type": TDetailType;
  detail: TDetail;
}

export type IoTHandler = Handler<IoTEvent, void>;

// IoT
// https://docs.aws.amazon.com/lambda/latest/dg/services-iot.html
// IoT payload is not restriced to JSON, but JSON is highly recommended. Types as string, number or array are possible to use.

export type IoTEvent<T = never> = string | number | T;

// PreProvisioningHook
// https://docs.aws.amazon.com/iot/latest/developerguide/pre-provisioning-hook.html
// When using AWS IoT fleet provisioning, you can set up a Lambda function to validate parameters passed from the device before allowing the device to be provisioned.
export type IoTPreProvisioningHookHandler = Handler<
  IoTPreProvisioningHookEvent,
  IoTPreProvisioningHookResult
>;

export interface IoTPreProvisioningHookEvent {
  claimCertificateId: string;
  certificateId: string;
  certificatePem: string;
  templateArn: string;
  clientId: string;
  parameters: Record<string, string>;
}

export interface IoTPreProvisioningHookResult {
  allowProvisioning: boolean;
  parameterOverrides: Record<string, string>;
}

export type FirehoseTransformationHandler = Handler<
  FirehoseTransformationEvent,
  FirehoseTransformationResult
>;

// Kinesis Data Firehose Event
// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-kinesis-firehose
// https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html
// https://aws.amazon.com/blogs/compute/amazon-kinesis-firehose-data-transformation-with-aws-lambda/
// Examples in the lambda blueprints
export interface FirehoseTransformationEvent {
  invocationId: string;
  deliveryStreamArn: string;
  region: string;
  records: FirehoseTransformationEventRecord[];
}

export interface FirehoseTransformationEventRecord {
  recordId: string;
  approximateArrivalTimestamp: number;
  /** Base64 encoded */
  data: string;
  kinesisRecordMetadata?: FirehoseRecordMetadata;
}

export interface FirehoseRecordMetadata {
  shardId: string;
  partitionKey: string;
  approximateArrivalTimestamp: number;
  sequenceNumber: string;
  subsequenceNumber: string;
}

export type FirehoseRecordTransformationStatus =
  | "Ok"
  | "Dropped"
  | "ProcessingFailed";

export interface FirehoseTransformationResultRecord {
  recordId: string;
  result: FirehoseRecordTransformationStatus;
  /** Encode in Base64 */
  data: string;
}

export interface FirehoseTransformationResult {
  records: FirehoseTransformationResultRecord[];
}

export type KinesisStreamHandler = Handler<KinesisStreamEvent, void>;

// Kinesis Streams
// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-kinesis-streams
export interface KinesisStreamRecordPayload {
  approximateArrivalTimestamp: number;
  data: string;
  kinesisSchemaVersion: string;
  partitionKey: string;
  sequenceNumber: string;
}

export interface KinesisStreamRecord {
  awsRegion: string;
  eventID: string;
  eventName: string;
  eventSource: string;
  eventSourceARN: string;
  eventVersion: string;
  invokeIdentityArn: string;
  kinesis: KinesisStreamRecordPayload;
}

export interface KinesisStreamEvent {
  Records: KinesisStreamRecord[];
}

export type LexHandler = Handler<LexEvent, LexResult>;

export interface LexEventSlots {
  [name: string]: string | undefined | null;
}

export interface LexEventSessionAttributes {
  [key: string]: string | undefined;
}

export interface LexEventRequestAttributes {
  [key: string]: string | undefined;
}

// Lex
// https://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html#supported-event-source-lex
export interface LexEvent {
  currentIntent: {
    name: string;
    slots: LexEventSlots;
    slotDetails: LexSlotDetails;
    confirmationStatus: "None" | "Confirmed" | "Denied";
  };
  bot: {
    name: string;
    alias: string;
    version: string;
  };
  userId: string;
  inputTranscript: string;
  invocationSource: "DialogCodeHook" | "FulfillmentCodeHook";
  outputDialogMode: "Text" | "Voice";
  messageVersion: "1.0";
  sessionAttributes: LexEventSessionAttributes;
  requestAttributes: LexEventRequestAttributes | null;
}

export interface LexSlotResolution {
  value: string;
}

export interface LexSlotDetail {
  // "at least 1 but no more than 5 items"
  resolutions: [
    LexSlotResolution,
    LexSlotResolution?,
    LexSlotResolution?,
    LexSlotResolution?,
    LexSlotResolution?,
  ];
  originalValue: string;
}

export interface LexSlotDetails {
  [name: string]: LexSlotDetail;
}

export interface LexGenericAttachment {
  title: string;
  subTitle: string;
  imageUrl: string;
  attachmentLinkUrl: string;
  buttons: Array<{
    text: string;
    value: string;
  }>;
}

export interface LexDialogActionBase {
  type: "Close" | "ElicitIntent" | "ElicitSlot" | "ConfirmIntent";
  message?: {
    contentType: "PlainText" | "SSML" | "CustomPayload";
    content: string;
  };
  responseCard?: {
    version: number;
    contentType: "application/vnd.amazonaws.card.generic";
    genericAttachments: LexGenericAttachment[];
  };
}

export interface LexDialogActionClose extends LexDialogActionBase {
  type: "Close";
  fulfillmentState: "Fulfilled" | "Failed";
}

export interface LexDialogActionElicitIntent extends LexDialogActionBase {
  type: "ElicitIntent";
}

export interface LexDialogActionElicitSlot extends LexDialogActionBase {
  type: "ElicitSlot";
  intentName: string;
  slots: { [name: string]: string | null };
  slotToElicit: string;
}

export interface LexDialogActionConfirmIntent extends LexDialogActionBase {
  type: "ConfirmIntent";
  intentName: string;
  slots: { [name: string]: string | null };
}

export interface LexDialogActionDelegate {
  type: "Delegate";
  slots: { [name: string]: string | null };
}

export type LexDialogAction =
  | LexDialogActionClose
  | LexDialogActionElicitIntent
  | LexDialogActionElicitSlot
  | LexDialogActionConfirmIntent
  | LexDialogActionDelegate;

export interface LexResult {
  sessionAttributes?: { [key: string]: string };
  dialogAction: LexDialogAction;
}

export type S3Handler = Handler<S3Event, void>;

/**
 * S3Create event
 * https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
 */

export interface S3EventRecordGlacierRestoreEventData {
  lifecycleRestorationExpiryTime: string;
  lifecycleRestoreStorageClass: string;
}

export interface S3EventRecordGlacierEventData {
  restoreEventData: S3EventRecordGlacierRestoreEventData;
}

export interface S3EventRecord {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  userIdentity: {
    principalId: string;
  };
  requestParameters: {
    sourceIPAddress: string;
  };
  responseElements: {
    "x-amz-request-id": string;
    "x-amz-id-2": string;
  };
  s3: {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: {
      name: string;
      ownerIdentity: {
        principalId: string;
      };
      arn: string;
    };
    object: {
      key: string;
      size: number;
      eTag: string;
      versionId?: string;
      sequencer: string;
    };
  };
  glacierEventData?: S3EventRecordGlacierEventData;
}

export interface S3Event {
  Records: S3EventRecord[];
}

export type S3CreateEvent = S3Event; // old name

/**
 * S3 Batch Operations event
 * https://docs.aws.amazon.com/AmazonS3/latest/dev/batch-ops-invoke-lambda.html
 */
export type S3BatchHandler = Handler<S3BatchEvent, S3BatchResult>;

export interface S3BatchEvent {
  invocationSchemaVersion: string;
  invocationId: string;
  job: S3BatchEventJob;
  tasks: S3BatchEventTask[];
}

export interface S3BatchEventJob {
  id: string;
}

export interface S3BatchEventTask {
  taskId: string;
  s3Key: string;
  s3VersionId: string | null;
  s3BucketArn: string;
}

export interface S3BatchResult {
  invocationSchemaVersion: string;
  treatMissingKeysAs: S3BatchResultResultCode;
  invocationId: string;
  results: S3BatchResultResult[];
}

export type S3BatchResultResultCode =
  | "Succeeded"
  | "TemporaryFailure"
  | "PermanentFailure";

export interface S3BatchResultResult {
  taskId: string;
  resultCode: S3BatchResultResultCode;
  resultString: string;
}

export type SESHandler = Handler<SESEvent, void>;

// SES event
export interface SESMailHeader {
  name: string;
  value: string;
}

export interface SESMailCommonHeaders {
  returnPath: string;
  from?: string[];
  date: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  sender?: string[];
  replyTo?: string[];
  messageId: string;
  subject?: string;
}

export interface SESMail {
  timestamp: string;
  source: string;
  messageId: string;
  destination: string[];
  headersTruncated: boolean;
  headers: SESMailHeader[];
  commonHeaders: SESMailCommonHeaders;
}

export interface SESReceiptStatus {
  status: "PASS" | "FAIL" | "GRAY" | "PROCESSING_FAILED" | "DISABLED";
}

export interface SESReceiptS3Action {
  type: "S3";
  topicArn?: string;
  bucketName: string;
  objectKey: string;
}

export interface SESReceiptSnsAction {
  type: "SNS";
  topicArn: string;
}

export interface SESReceiptBounceAction {
  type: "Bounce";
  topicArn?: string;
  smtpReplyCode: string;
  statusCode: string;
  message: string;
  sender: string;
}

export interface SESReceiptLambdaAction {
  type: "Lambda";
  topicArn?: string;
  functionArn: string;
  invocationType: string;
}

export interface SESReceiptStopAction {
  type: "Stop";
  topicArn?: string;
}

export interface SESReceiptWorkMailAction {
  type: "WorkMail";
  topicArn?: string;
  organizationArn: string;
}

export interface SESReceipt {
  timestamp: string;
  processingTimeMillis: number;
  recipients: string[];
  spamVerdict: SESReceiptStatus;
  virusVerdict: SESReceiptStatus;
  spfVerdict: SESReceiptStatus;
  dkimVerdict: SESReceiptStatus;
  dmarcVerdict: SESReceiptStatus;
  dmarcPolicy?: "none" | "quarantine" | "reject";
  action:
    | SESReceiptS3Action
    | SESReceiptSnsAction
    | SESReceiptBounceAction
    | SESReceiptLambdaAction
    | SESReceiptStopAction
    | SESReceiptWorkMailAction;
}

export interface SESMessage {
  mail: SESMail;
  receipt: SESReceipt;
}

export interface SESEventRecord {
  eventSource: string;
  eventVersion: string;
  ses: SESMessage;
}

export interface SESEvent {
  Records: SESEventRecord[];
}

export type SNSHandler = Handler<SNSEvent, void>;

// SNS "event"
export interface SNSMessageAttribute {
  Type: string;
  Value: string;
}

export interface SNSMessageAttributes {
  [name: string]: SNSMessageAttribute;
}

export interface SNSMessage {
  SignatureVersion: string;
  Timestamp: string;
  Signature: string;
  SigningCertUrl: string;
  MessageId: string;
  Message: string;
  MessageAttributes: SNSMessageAttributes;
  Type: string;
  UnsubscribeUrl: string;
  TopicArn: string;
  Subject: string;
}

export interface SNSEventRecord {
  EventVersion: string;
  EventSubscriptionArn: string;
  EventSource: string;
  Sns: SNSMessage;
}

export interface SNSEvent {
  Records: SNSEventRecord[];
}

export type SQSHandler = Handler<SQSEvent, void>;

// SQS
// https://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html#supported-event-source-sqs
export interface SQSRecord {
  messageId: string;
  receiptHandle: string;
  body: string;
  attributes: SQSRecordAttributes;
  messageAttributes: SQSMessageAttributes;
  md5OfBody: string;
  eventSource: string;
  eventSourceARN: string;
  awsRegion: string;
}

export interface SQSEvent {
  Records: SQSRecord[];
}

export interface SQSRecordAttributes {
  AWSTraceHeader?: string;
  ApproximateReceiveCount: string;
  SentTimestamp: string;
  SenderId: string;
  ApproximateFirstReceiveTimestamp: string;
  SequenceNumber?: string;
  MessageGroupId?: string;
  MessageDeduplicationId?: string;
}

export type SQSMessageAttributeDataType =
  | "String"
  | "Number"
  | "Binary"
  | string;

export interface SQSMessageAttribute {
  stringValue?: string;
  binaryValue?: string;
  stringListValues: never[]; // Not implemented. Reserved for future use.
  binaryListValues: never[]; // Not implemented. Reserved for future use.
  dataType: SQSMessageAttributeDataType;
}

export interface SQSMessageAttributes {
  [name: string]: SQSMessageAttribute;
}
