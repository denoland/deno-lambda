resource "aws_lambda_layer_version" "deno" {
  filename         = var.lambda_layer_file
  layer_name       = "${local.project}_deno_layer"
  source_code_hash = filebase64sha256(var.lambda_layer_file)
}

resource "aws_lambda_function" "api" {
  filename         = var.lambda_file
  function_name    = local.api_lambda_name
  handler          = "example-terraform/hello.handler"
  timeout          = 10
  memory_size      = 128
  role             = aws_iam_role.lambda.arn
  runtime          = "provided.al2"
  source_code_hash = filebase64sha256(var.lambda_file)

  layers = [aws_lambda_layer_version.deno.arn]


}
