terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.4"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}
data "aws_region" "current" {}

// Default Provider

provider "aws" {
  region = var.region
}

