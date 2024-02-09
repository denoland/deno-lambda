## Quick Start in the AWS console

From the [AWS console](https://console.aws.amazon.com/lambda/):

1. Download zip files from the
   [releases](https://github.com/denoland/deno-lambda/releases) page.

2. Create a _layer_ and upload `deno-lambda-layer.zip`.

<img width="828" alt="Create layer" src="https://user-images.githubusercontent.com/1931852/68455786-0b618100-01b1-11ea-988a-ba3a5810a8d5.png">

<img width="1122" alt="Layer created" src="https://user-images.githubusercontent.com/1931852/68455785-0b618100-01b1-11ea-9686-8ebefe3b00ff.png">

Note its Version ARN.

3. Create a lambda function from scratch with runtime "provide your own
   bootstrap".

<img width="1295" alt="Create function" src="https://user-images.githubusercontent.com/1931852/68455784-0ac8ea80-01b1-11ea-93ba-8c64a4e487e7.png">

<img width="1300" alt="Function created" src="https://user-images.githubusercontent.com/1931852/68455783-0ac8ea80-01b1-11ea-9d84-f0824549ffda.png">

4. Add a layer using the ARN above.

<img width="820" alt="Add layer to function" src="https://user-images.githubusercontent.com/1931852/68455782-0ac8ea80-01b1-11ea-9a1b-0a87f8052c25.png">

5. Upload deno-lambda-example.zip as function code.

<img width="1300" alt="Upload function code" src="https://user-images.githubusercontent.com/1931852/68455780-0ac8ea80-01b1-11ea-87ee-164abe110c77.png">

6. "Save". "Test" (use the default event).

<img width="1277" alt="Execution successful" src="https://user-images.githubusercontent.com/1931852/70288824-bb61e400-1787-11ea-95a6-61bb3a260c05.png">
