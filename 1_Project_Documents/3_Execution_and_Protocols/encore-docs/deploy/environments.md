# Encore Deployment Environments

## Overview

Encore provides comprehensive environment management for deploying applications across different stages of the development lifecycle. Each environment is isolated with its own resources, configurations, and data.

## Environment Types

### Development Environment
- **Local development**: Runs on your machine with `encore run`
- **Hot reloading**: Automatic code reloading during development
- **Local dashboard**: Built-in development tools and API explorer
- **Ephemeral databases**: Automatically created and managed

### Staging/Preview Environments
- **Pull request previews**: Automatic environment creation for PRs
- **Integration testing**: Safe environment for testing changes
- **Shared staging**: Stable environment for team collaboration
- **Production-like**: Mirrors production configuration

### Production Environment
- **High availability**: Redundant infrastructure and failover
- **Monitoring**: Comprehensive observability and alerting
- **Scaling**: Automatic scaling based on traffic
- **Security**: Enhanced security controls and access management

## Environment Configuration

### Environment Variables

Configure environment-specific settings:

```typescript
// Access environment variables
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.EXTERNAL_API_KEY;
```

### Secrets Management

Store sensitive configuration securely:

```bash
# Set secrets for specific environment
encore secret set --env=prod DATABASE_PASSWORD
encore secret set --env=staging STRIPE_SECRET_KEY

# List secrets
encore secret list --env=prod
```

### Service Configuration

Environment-specific service configuration:

```typescript
// encore.service.ts
import { Service } from "encore.dev/service";

export default new Service("myservice", {
  // Environment-specific middleware
  middlewares: process.env.NODE_ENV === 'production' ? [authMiddleware] : []
});
```

## Deployment Strategies

### Automatic Deployment

```bash
# Deploy to default environment
git push encore

# Deploy to specific environment
encore deploy --env=staging
```

### Manual Deployment

```bash
# Deploy specific branch to environment
encore deploy --env=prod --branch=release-v1.2.0

# Deploy with custom message
encore deploy --env=prod --message="Hotfix for payment processing"
```

### Preview Environments

Automatic preview environments for pull requests:
- Created automatically on PR creation
- Updated on each commit
- Destroyed when PR is closed
- Full isolation from other environments

## Environment Management

### Creating Environments

```bash
# Create new environment
encore env create staging

# Clone existing environment configuration
encore env clone prod staging
```

### Environment Configuration

```bash
# List all environments
encore env list

# View environment details
encore env show prod

# Update environment settings
encore env configure prod
```

### Database Management

Each environment has isolated databases:

```bash
# Connect to environment database
encore db shell mydb --env=prod

# Get connection string
encore db conn-uri mydb --env=staging

# Reset development database
encore db reset --env=dev
```

## Environment Isolation

### Resource Separation
- **Databases**: Completely isolated per environment
- **Object storage**: Separate buckets/containers
- **Secrets**: Environment-specific secret stores
- **Logs**: Isolated logging and monitoring

### Network Isolation
- **VPC separation**: Production networks isolated
- **Security groups**: Environment-specific access controls
- **Load balancers**: Dedicated load balancing per environment

## Monitoring and Observability

### Environment-Specific Monitoring

```bash
# View logs for specific environment
encore logs --env=prod --service=payment

# Stream logs in real-time
encore logs --env=staging --follow
```

### Performance Monitoring
- **Metrics**: Environment-specific performance metrics
- **Alerts**: Custom alerting per environment
- **Tracing**: Distributed tracing with environment context

## Best Practices

### Environment Promotion
1. **Development**: Local development and testing
2. **Staging**: Integration testing and QA
3. **Production**: Live user traffic

### Configuration Management
- Use environment variables for configuration
- Store secrets securely with `encore secret`
- Avoid hardcoding environment-specific values
- Test configuration changes in staging first

### Deployment Safety
- **Gradual rollouts**: Deploy to staging before production
- **Health checks**: Verify deployment success
- **Rollback capability**: Quick rollback for issues
- **Database migrations**: Test migrations in staging

### Security Considerations
- **Access controls**: Restrict production access
- **Audit logging**: Track all production changes
- **Secret rotation**: Regular secret updates
- **Compliance**: Meet regulatory requirements per environment

## Advanced Features

### Custom Domains
```bash
# Configure custom domain for environment
encore env domain set --env=prod api.mycompany.com
```

### Auto-scaling Configuration
Environment-specific scaling rules:
- **Development**: Minimal resources
- **Staging**: Moderate scaling for testing
- **Production**: Aggressive scaling for performance

### Backup and Recovery
- **Automated backups**: Scheduled database backups
- **Point-in-time recovery**: Restore to specific timestamps
- **Cross-environment restore**: Restore production data to staging

## Troubleshooting

### Common Issues
- **Environment access**: Check permissions and authentication
- **Configuration drift**: Verify environment-specific settings
- **Resource limits**: Monitor resource usage and limits

### Debugging Tools
```bash
# Check environment status
encore env status --env=prod

# Validate configuration
encore check --env=staging

# Debug deployment issues
encore deploy --env=prod --verbose
```