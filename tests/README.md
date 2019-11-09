# Tests

In order to run the tests you run the `Dockerfile`:

```
docker build -f Dockerfile -t test-runner .. && docker run test-runner
```

_Note: it runs in the `..` (root) context._

The idea is to use the same image which AWS Lambda runs its bootstrap script on.
We create a server which the bootstrap points to as its `AWS_LAMBDA_RUNTIME_API`.

For each `.json` test file we execute the provided handler with the array of events.
See these files for syntax.
