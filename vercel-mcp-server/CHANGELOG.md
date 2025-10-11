# Changelog

All notable changes to the Vercel MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

#### Project Management
- `list_projects` - List all Vercel projects with metadata
- `get_project` - Get detailed project information including settings and deployments
- `get_project_domains` - View all domains configured for a project

#### Deployment Operations
- `list_deployments` - List deployments with filtering by target (production/preview/development)
- `get_deployment` - Get detailed deployment information including status and metrics
- `create_deployment` - Trigger new deployments with optional Git source specification
- `cancel_deployment` - Cancel running deployments
- `get_deployment_logs` - Retrieve build and runtime logs for debugging

#### Environment Variables
- `list_env_variables` - List all environment variables for a project
- `create_env_variable` - Create new environment variables with environment targeting
- `update_env_variable` - Update existing environment variable values
- `delete_env_variable` - Remove environment variables from projects

#### Developer Experience
- Comprehensive error handling with detailed error messages
- Automatic JSON formatting for all responses
- Support for encrypted, secret, and plain text environment variables
- Environment-specific variable targeting (production, preview, development)
- Rate limit awareness in documentation

#### Documentation
- Complete README with setup instructions for Claude Desktop
- USAGE.md with real-world scenarios for AI Halloween Transform app
- Setup script (`setup.sh`) for automated installation
- `.env.example` template for configuration
- Security best practices guide
- Troubleshooting guide for common issues

#### Configuration
- TypeScript support with full type definitions
- ESM module format for modern Node.js
- Zod schemas for input validation
- STDIO transport for MCP protocol

### Security
- Secure token handling via environment variables
- Support for encrypted environment variables in Vercel
- No hardcoded credentials or sensitive data
- Token validation on startup

### Developer Tools
- `npm run dev` - Development mode with auto-reload
- `npm run build` - Production build
- TypeScript compilation with source maps
- Automated setup script for first-time configuration

## [Unreleased]

### Planned Features
- `create_project` - Create new Vercel projects from templates
- `update_project` - Modify project settings and configuration
- `delete_project` - Remove projects from Vercel
- `add_domain` - Add custom domains to projects
- `remove_domain` - Remove domains from projects
- `get_analytics` - Retrieve analytics data for deployments
- `list_logs` - Stream real-time logs for running deployments
- `get_build_cache` - View build cache statistics
- `clear_build_cache` - Clear build cache for projects
- Webhook management tools
- Team and collaboration management
- Deployment aliases and custom URLs
- Integration with Vercel Edge Config
- Vercel KV database operations
- Rate limiting implementation
- Batch operations support

### Planned Improvements
- Add retry logic for failed API requests
- Implement caching for frequently accessed data
- Add progress indicators for long-running operations
- Support for Vercel Teams API
- Enhanced logging and debugging options
- Performance metrics and monitoring
- Automated testing suite
- Integration tests with mock Vercel API

## Notes

### Breaking Changes
None - Initial release

### Migration Guide
Not applicable - Initial release

### Known Issues
- API rate limits are not enforced by the server
- Large log files may take time to retrieve
- Deployment cancellation may take a few seconds to reflect in status

### Compatibility
- Requires Node.js 18.0.0 or higher
- Compatible with MCP SDK 1.0.0+
- Tested with Claude for Desktop
- Works with any MCP-compatible client

### Dependencies
- `@modelcontextprotocol/sdk`: ^1.0.0
- `@vercel/client`: ^13.0.0
- `zod`: ^3.22.0

---

For more information, see the [README](README.md) and [USAGE](USAGE.md) guides.