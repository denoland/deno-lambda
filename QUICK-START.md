For an even quicker start, deploy the example application
[deno-hello-world](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:390065572566:applications~deno-hello-world)
sample SAR application.

## Quick Start in the AWS console

1. Visit the [deno SAR application](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:390065572566:applications~deno)
and click the Deploy button:

<img width="1301" alt="Screen Shot 2020-02-17 at 14 42 36" src="https://user-images.githubusercontent.com/1931852/74705321-50da1500-51c8-11ea-8709-afc3d46dde8c.png">

This will take you to your preferred region to Deploy:

<img width="1249" alt="Screen Shot 2020-02-17 at 14 43 05" src="https://user-images.githubusercontent.com/1931852/74705319-50417e80-51c8-11ea-8082-329ff3e7ea9f.png">

2. Now the serverless repo will `CREATE` the deno layer:

<img width="1250" alt="Screen Shot 2020-02-17 at 14 43 44" src="https://user-images.githubusercontent.com/1931852/74705318-4e77bb00-51c8-11ea-8d4d-3b3282adb2ea.png">

Click on "View Cloudformation Stack":

<img width="1157" alt="Screen Shot 2020-02-17 at 14 46 52" src="https://user-images.githubusercontent.com/1931852/74705317-4d468e00-51c8-11ea-845c-1a2e5bf8bb3d.png">

On the "Outputs" tab copy the `LayerArn`.

3. Visit the [lambda console](https://console.aws.amazon.com/lambda/).
Create a lambda function from scratch with runtime "provide your own bootstrap".

<img width="1295" alt="Create function" src="https://user-images.githubusercontent.com/1931852/68455784-0ac8ea80-01b1-11ea-93ba-8c64a4e487e7.png">

<img width="1300" alt="Function created" src="https://user-images.githubusercontent.com/1931852/68455783-0ac8ea80-01b1-11ea-9d84-f0824549ffda.png">

4. Add a layer using the ARN above.

<img width="820" alt="Add layer to function" src="https://user-images.githubusercontent.com/1931852/68455782-0ac8ea80-01b1-11ea-9a1b-0a87f8052c25.png">

5. Upload the latest [deno-lambda-example.zip](https://github.com/hayd/deno-lambda/releases)
as function code.

<img width="1300" alt="Upload function code" src="https://user-images.githubusercontent.com/1931852/68455780-0ac8ea80-01b1-11ea-87ee-164abe110c77.png">

6. "Save". "Test" (use the default event).

<img width="1277" alt="Execution successful" src="https://user-images.githubusercontent.com/1931852/70288824-bb61e400-1787-11ea-95a6-61bb3a260c05.png">

---

_To "roll your own", without SAR, see the earlier version of this
[QUICK-START.md](https://github.com/hayd/deno-lambda/blob/56d8b4e4030c0096f7b5c589ba1194201e2f97dc/QUICK-START.md)._
