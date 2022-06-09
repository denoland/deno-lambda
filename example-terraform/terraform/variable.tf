variable "region" {
  default = "us-west-2"
}

variable "app_namespace" {
  default = "deno-lambda"
}

variable "lambda_file" {
  default = "/deno-lambda/example-terraform/build/lambda.zip"
}

variable "lambda_layer_file" {
  default = "/deno-lambda/example-terraform/build/layer.zip"
}

#-------------------------------------------
# Interpolated Values
#-------------------------------------------

locals {
  project = "${var.app_namespace}_${terraform.workspace}"
  api_lambda_name       = "${local.project}_api"
}
