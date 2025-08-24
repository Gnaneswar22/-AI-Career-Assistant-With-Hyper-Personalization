# Environment Variables for Career AI Assistant

This document lists all the environment variables required for the Career AI Assistant project. Create a `.env` file in the root directory and add these variables with your actual values.

## Quick Start

1. Copy this file to `.env` in your project root
2. Replace all `your_*_here` values with your actual API keys and configuration
3. Never commit the `.env` file to version control

## Required Environment Variables

### API Keys for Job Board Services

```bash
# Adzuna Job Board API
ADZUNA_API_KEY=your_adzuna_api_key_here
ADZUNA_APP_ID=your_adzuna_app_id_here

# ArbeitNow Job Board API
ARBEITNOW_API_KEY=your_arbeitnow_api_key_here

# Careerjet Job Board API
CAREERJET_API_KEY=your_careerjet_api_key_here
```

### AI/LLM Services

```bash
# OpenRouter API for AI completions (used in resume generation and roadmap generation)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# OpenAI API (alternative to OpenRouter)
OPENAI_API_KEY=your_openai_api_key_here
```

### Database Configuration

```bash
# PostgreSQL Database URL
DATABASE_URL=postgresql://username:password@localhost:5432/career_ai_db

# Database connection pool settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

### Application Configuration

```bash
# Next.js Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Application Secret for JWT tokens and session management
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Authentication & Security

```bash
# JWT Secret for token signing
JWT_SECRET=your_jwt_secret_here

# Session Secret
SESSION_SECRET=your_session_secret_here
```

### File Storage & Media

```bash
# File upload configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads
```

### Email Configuration (for notifications)

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password_here
```

### Blockchain Configuration (for certificate verification)

```bash
# Blockchain API endpoint (if using external service)
BLOCKCHAIN_API_URL=https://api.blockchain-service.com
BLOCKCHAIN_API_KEY=your_blockchain_api_key_here
```

### Development & Debugging

```bash
# Enable debug logging
DEBUG=true

# Log level
LOG_LEVEL=info
```

### Feature Flags

```bash
# Enable/disable specific features
ENABLE_JOB_INGESTION=true
ENABLE_AI_GENERATION=true
ENABLE_CERTIFICATE_GENERATION=true
ENABLE_BLOCKCHAIN_VERIFICATION=false
```

### Rate Limiting

```bash
# API rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### External Service URLs

```bash
# LinkedIn API (if implementing LinkedIn integration)
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# GitHub API (if implementing GitHub integration)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

### Model Training & AI Configuration

```bash
# Model output directory for fine-tuned models
MODEL_OUTPUT_DIR=./career-ai-roadmap-model

# Weights & Biases (for model training tracking)
WANDB_API_KEY=your_wandb_api_key_here
```

### Monitoring & Analytics

```bash
# Sentry for error tracking
SENTRY_DSN=your_sentry_dsn_here

# Google Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here
```

### Deployment Configuration

```bash
# Production URL (update when deploying)
PRODUCTION_URL=https://your-domain.com

# CDN URL for static assets
CDN_URL=https://cdn.your-domain.com
```

## How to Get API Keys

### Job Board APIs
- **Adzuna**: Sign up at [adzuna.com](https://developer.adzuna.com/)
- **ArbeitNow**: Contact their API team
- **Careerjet**: Sign up at [careerjet.com](https://www.careerjet.com/partners/api/)

### AI Services
- **OpenRouter**: Sign up at [openrouter.ai](https://openrouter.ai/) for access to multiple AI models
- **OpenAI**: Sign up at [platform.openai.com](https://platform.openai.com/)

### Database
- **PostgreSQL**: Use a local installation or cloud service like:
  - [Supabase](https://supabase.com/)
  - [Neon](https://neon.tech/)
  - [Railway](https://railway.app/)

### Authentication
- **NextAuth**: Generate a secure secret using:
  ```bash
  openssl rand -base64 32
  ```

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT and session keys
3. **Rotate API keys** regularly
4. **Use environment-specific configurations** (dev/staging/prod)
5. **Limit API key permissions** to only what's needed

## Development vs Production

For development, you can use:
- Local PostgreSQL database
- Development API keys (if available)
- Local file storage
- Debug logging enabled

For production, ensure:
- Secure database connections
- Production API keys
- Cloud storage for files
- Proper logging and monitoring
- HTTPS everywhere
- Rate limiting enabled

