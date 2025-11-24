# AWS Deployment Guide

This guide covers deploying the Life Sciences LMS backend to AWS using various deployment options.

## Deployment Options

### Option 1: AWS ECS (Elastic Container Service) - Recommended
Containerized deployment with auto-scaling and load balancing.

**Architecture:**
- ECS Fargate for serverless container hosting
- Application Load Balancer
- RDS PostgreSQL for database
- ElastiCache Redis for session management
- CloudWatch for logging and monitoring

**Deployment Steps:**

1. **Prerequisites:**
```bash
# Install AWS CLI
aws --version

# Configure credentials
aws configure
```

2. **Build and Push Docker Image:**
```bash
# Build image
docker build -t lifesci-lms-server .

# Tag for ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag lifesci-lms-server:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/lifesci-lms-server:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/lifesci-lms-server:latest
```

3. **Deploy using CloudFormation:**
```bash
cd deployment/aws
aws cloudformation create-stack \
  --stack-name lifesci-lms \
  --template-body file://cloudformation-ecs.yaml \
  --parameters ParameterKey=ImageUri,ParameterValue=<account-id>.dkr.ecr.us-east-1.amazonaws.com/lifesci-lms-server:latest \
  --capabilities CAPABILITY_IAM
```

### Option 2: AWS Lambda + API Gateway
Serverless deployment for cost-effective scaling.

**Architecture:**
- Lambda functions for API endpoints
- API Gateway for routing
- RDS Proxy for database connection pooling
- Secrets Manager for credentials

**Note:** Requires code adaptation for Lambda handler format.

### Option 3: AWS Elastic Beanstalk
Platform-as-a-Service deployment with minimal configuration.

**Deployment:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js lifesci-lms-server

# Create environment
eb create lifesci-lms-production

# Deploy
eb deploy
```

## Environment Variables

Set environment variables using AWS Systems Manager Parameter Store or Secrets Manager:

```bash
# Store secrets
aws secretsmanager create-secret \
  --name lifesci-lms/jwt-secret \
  --secret-string "your-secure-jwt-secret"

aws secretsmanager create-secret \
  --name lifesci-lms/openai-api-key \
  --secret-string "your-openai-api-key"
```

## Database Setup

**RDS PostgreSQL:**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier lifesci-lms-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username postgres \
  --master-user-password <secure-password> \
  --allocated-storage 20 \
  --backup-retention-period 30 \
  --storage-encrypted
```

## Monitoring and Logging

**CloudWatch:**
- Application logs sent to CloudWatch Logs
- Metrics for API requests, errors, latency
- Alarms for critical issues

**X-Ray:**
- Distributed tracing for request flow
- Performance analysis

## Security Checklist

- [x] VPC with private subnets for database
- [x] Security groups restricting inbound traffic
- [x] SSL/TLS certificates from ACM
- [x] Secrets stored in Secrets Manager
- [x] IAM roles with least privilege
- [x] Encryption at rest and in transit
- [x] WAF for API Gateway protection
- [x] CloudTrail for audit logging

## Cost Optimization

- Use Fargate Spot for non-critical workloads
- Enable auto-scaling with appropriate thresholds
- Use RDS Reserved Instances for production
- Enable S3 lifecycle policies for logs
- Use CloudWatch Logs retention policies

## Disaster Recovery

**Backup Strategy:**
- RDS automated backups (30-day retention)
- Manual snapshots before major changes
- Cross-region backup replication

**Recovery Procedure:**
1. Restore RDS from snapshot
2. Deploy latest container image
3. Update DNS to new environment
4. Verify data integrity
