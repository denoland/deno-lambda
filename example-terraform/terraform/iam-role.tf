#Role the lambda will be executed with
resource "aws_iam_role" "lambda" {
  name = "${local.project}_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = ["lambda.amazonaws.com", "states.amazonaws.com"]
        }
      },
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "logs.${data.aws_region.current.name}.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_exec" {
  name = "lambda_exec"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Resource = "*"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        }, {
        Effect   = "Allow"
        Resource = "arn:${data.aws_partition.current.partition}:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:${local.project}*"
        Action = [
          "lambda:GetFunctionConfiguration",
          "lambda:InvokeAsync",
          "lambda:InvokeFunction",
          "lambda:Invoke",
          "lambda:UpdateFunctionConfiguration"
        ]
        }, {
        Effect   = "Allow"
        Resource = "arn:${data.aws_partition.current.partition}:states:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:stateMachine:${local.project}*"
        Action = [
          "states:StartExecution",
          "states:SendTaskFailure",
          "states:SendTaskSuccess"
        ]
      },
    ]
  })
}