module "api_gateway" {
  source = "terraform-aws-modules/apigateway-v2/aws"

  name            = local.project
  protocol_type   = "HTTP"
  create_vpc_link = false

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  # Custom domain
  create_api_domain_name      = false

  # Routes and integrations
  integrations = {
    "ANY /{proxy+}" = {
      lambda_arn             = aws_lambda_function.api.arn
      payload_format_version = "2.0"
      # authorization_type     = "JWT"
      timeout_milliseconds = 30000
    }
  }
}

#############################
# AWS API Gateway Permission to Lambda
#############################

resource "aws_lambda_permission" "api_lambda" {
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  statement_id  = "AllowExecutionFromAPIGateway"
  function_name = aws_lambda_function.api.arn
  source_arn    = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
}
