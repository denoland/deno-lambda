export interface Context {
  functionName: string;
  functionVersion: string; // or Number?
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  awsRequestId: string;
  logGroupName: string;
  logStreamName: string;
  identity: undefined;
  clientContext: undefined;
  getRemainingTimeInMillis: () => Number;
}

// In future this could be an enum with various types of Events
export interface Event {
  [key: string]: any;
}
