# Azure Deployment Guide

This guide covers deploying the Life Sciences LMS backend to Microsoft Azure.

## Deployment Options

### Option 1: Azure App Service - Recommended
Fully managed platform for web applications with built-in scaling.

**Architecture:**
- App Service for Node.js hosting
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Application Insights for monitoring

**Deployment Steps:**

1. **Prerequisites:**
```bash
# Install Azure CLI
az --version

# Login
az login
```

2. **Create Resource Group:**
```bash
az group create \
  --name lifesci-lms-rg \
  --location eastus
```

3. **Create App Service:**
```bash
# Create App Service Plan
az appservice plan create \
  --name lifesci-lms-plan \
  --resource-group lifesci-lms-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name lifesci-lms-server \
  --resource-group lifesci-lms-rg \
  --plan lifesci-lms-plan \
  --runtime "NODE:20-lts"
```

4. **Deploy Code:**
```bash
# Using ZIP deployment
npm run build
zip -r deploy.zip dist package.json node_modules

az webapp deployment source config-zip \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-server \
  --src deploy.zip
```

### Option 2: Azure Container Instances
Serverless container deployment for simple workloads.

**Deployment:**
```bash
# Build and push to Azure Container Registry
az acr create \
  --resource-group lifesci-lms-rg \
  --name lifescilmsacr \
  --sku Basic

az acr build \
  --registry lifescilmsacr \
  --image lifesci-lms-server:latest .

# Deploy to Container Instances
az container create \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-server \
  --image lifescilmsacr.azurecr.io/lifesci-lms-server:latest \
  --cpu 1 \
  --memory 1 \
  --ports 3000 \
  --environment-variables \
    NODE_ENV=production \
    PORT=3000
```

### Option 3: Azure Kubernetes Service (AKS)
Enterprise-grade orchestration for complex deployments.

**Deployment:**
```bash
# Create AKS cluster
az aks create \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-aks \
  --node-count 2 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-aks

# Deploy using kubectl
kubectl apply -f kubernetes-deployment.yaml
```

## Database Setup

**Azure Database for PostgreSQL:**
```bash
az postgres flexible-server create \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-db \
  --location eastus \
  --admin-user dbadmin \
  --admin-password <secure-password> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 16 \
  --storage-size 32 \
  --backup-retention 30
```

**Azure Cache for Redis:**
```bash
az redis create \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-cache \
  --location eastus \
  --sku Basic \
  --vm-size c0
```

## Environment Variables

**Using App Settings:**
```bash
az webapp config appsettings set \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-server \
  --settings \
    NODE_ENV=production \
    DATABASE_URL=@Microsoft.KeyVault(...) \
    JWT_SECRET=@Microsoft.KeyVault(...) \
    OPENAI_API_KEY=@Microsoft.KeyVault(...)
```

**Azure Key Vault:**
```bash
# Create Key Vault
az keyvault create \
  --name lifesci-lms-kv \
  --resource-group lifesci-lms-rg \
  --location eastus

# Store secrets
az keyvault secret set \
  --vault-name lifesci-lms-kv \
  --name jwt-secret \
  --value "your-secure-jwt-secret"
```

## Monitoring and Logging

**Application Insights:**
```bash
# Create Application Insights
az monitor app-insights component create \
  --app lifesci-lms-insights \
  --location eastus \
  --resource-group lifesci-lms-rg

# Link to App Service
az webapp config appsettings set \
  --resource-group lifesci-lms-rg \
  --name lifesci-lms-server \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING=<connection-string>
```

## Security Checklist

- [x] Virtual Network integration
- [x] Network Security Groups
- [x] SSL/TLS certificates from Azure
- [x] Secrets in Key Vault
- [x] Managed Identity for authentication
- [x] Encryption at rest and in transit
- [x] Azure Firewall or Application Gateway
- [x] Azure Activity Log for audit trail

## CI/CD Integration

**Azure DevOps:**
```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
  
  - script: |
      npm ci
      npm run build
    displayName: 'Build'
  
  - task: AzureWebApp@1
    inputs:
      azureSubscription: '<subscription>'
      appName: 'lifesci-lms-server'
      package: '$(System.DefaultWorkingDirectory)'
```

## Cost Optimization

- Use Basic tier for development/testing
- Enable auto-scaling for production
- Use Azure Reserved Instances
- Implement Azure CDN for static content
- Set up budget alerts

## Disaster Recovery

**Backup Strategy:**
- PostgreSQL automated backups (30 days)
- Geo-redundant backup storage
- App Service backup configuration

**Recovery Procedure:**
1. Restore database from backup
2. Deploy to secondary region
3. Update Traffic Manager
4. Verify functionality
