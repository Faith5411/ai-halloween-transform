# Vercel MCP Server

A Model Context Protocol (MCP) server that enables Claude and other MCP clients to deploy and manage projects on Vercel directly through natural language conversations.

## Overview

This MCP server provides tools to:
- 📦 List and inspect Vercel projects
- 🚀 Create and manage deployments
- 📊 View deployment logs and status
- 🔐 Manage environment variables
- 🌐 Configure domains
- 🔍 Monitor deployment health

## Features

- **Project Management**: List projects, view details, and monitor deployments
- **Deployment Control**: Trigger new deployments, cancel running builds, view logs
- **Environment Variables**: Create, update, and delete environment variables across environments
- **Domain Configuration**: View and manage custom domains
- **Real-time Status**: Check deployment status and build logs

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **Vercel Account**: Active account with projects
- **Vercel Token**: API token with appropriate permissions
- **Claude for Desktop**: (Optional) For using with Claude

## Installation

### 1. Install Dependencies

```bash
cd vercel-mcp-server
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Get Your Vercel API Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a descriptive name (e.g., "MCP Server")
4. Select scope: **Full Account** (recommended) or specific teams
5. Click "Create" and copy the token immediately
6. Store it securely - you won't be able to see it again

## Configuration

### For Claude for Desktop

Edit your Claude Desktop configuration file:

**macOS/Linux:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```cmd
notepad %APPDATA%\Claude\claude_desktop_config.json
```

Add the Vercel MCP server configuration:

```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/vercel-mcp-server/dist/index.js"
      ],
      "env": {
        "VERCEL_TOKEN": "your_vercel_token_here"
      }
    }
  }
}
```

**Important:**
- Replace `/ABSOLUTE/PATH/TO/vercel-mcp-server` with the actual absolute path
- Replace `your_vercel_token_here` with your Vercel API token
- On Windows, use double backslashes (`\\`) or forward slashes (`/`) in paths

### For Other MCP Clients

Set the `VERCEL_TOKEN` environment variable and run:

```bash
export VERCEL_TOKEN="your_vercel_token_here"
node dist/index.js
```

## Available Tools

### 1. `list_projects`
List all Vercel projects in your account.

**Parameters:**
- `limit` (optional): Maximum number of projects (default: 20)

**Example:**
```
Show me all my Vercel projects
```

### 2. `get_project`
Get detailed information about a specific project.

**Parameters:**
- `projectId` (required): Project ID or name

**Example:**
```
Get details for my ai-halloween project
```

### 3. `list_deployments`
List deployments for a project.

**Parameters:**
- `projectId` (required): Project ID or name
- `limit` (optional): Maximum deployments (default: 10)
- `target` (optional): Filter by production/preview/development

**Example:**
```
Show me the last 5 deployments for ai-halloween
```

### 4. `get_deployment`
Get detailed deployment information including status and metrics.

**Parameters:**
- `deploymentId` (required): Deployment ID or URL

**Example:**
```
Get details for deployment dpl_abc123
```

### 5. `create_deployment`
Trigger a new deployment.

**Parameters:**
- `projectId` (required): Project ID or name
- `target` (optional): production or preview (default: preview)
- `gitSource` (optional): Specify branch or commit SHA

**Example:**
```
Deploy ai-halloween to production
```

### 6. `cancel_deployment`
Cancel a running deployment.

**Parameters:**
- `deploymentId` (required): Deployment ID to cancel

**Example:**
```
Cancel deployment dpl_abc123
```

### 7. `get_deployment_logs`
View build and runtime logs for debugging.

**Parameters:**
- `deploymentId` (required): Deployment ID
- `limit` (optional): Max log entries (default: 100)

**Example:**
```
Show me the logs for the latest ai-halloween deployment
```

### 8. `list_env_variables`
List all environment variables for a project.

**Parameters:**
- `projectId` (required): Project ID or name

**Example:**
```
Show me all environment variables for ai-halloween
```

### 9. `create_env_variable`
Create a new environment variable.

**Parameters:**
- `projectId` (required): Project ID or name
- `key` (required): Variable name (e.g., VITE_API_KEY)
- `value` (required): Variable value
- `target` (optional): Environments [production, preview, development]
- `type` (optional): plain, secret, or encrypted (default: encrypted)

**Example:**
```
Add VITE_SUPABASE_URL environment variable to ai-halloween for all environments
```

### 10. `update_env_variable`
Update an existing environment variable.

**Parameters:**
- `projectId` (required): Project ID or name
- `envId` (required): Environment variable ID
- `value` (required): New value
- `target` (optional): Updated environments

**Example:**
```
Update the VITE_API_KEY variable for ai-halloween
```

### 11. `delete_env_variable`
Remove an environment variable.

**Parameters:**
- `projectId` (required): Project ID or name
- `envId` (required): Environment variable ID

**Example:**
```
Delete the OLD_API_KEY variable from ai-halloween
```

### 12. `get_project_domains`
List all domains configured for a project.

**Parameters:**
- `projectId` (required): Project ID or name

**Example:**
```
Show me all domains for ai-halloween
```

## Usage Examples

### Deploy Your Project

```
Deploy my ai-halloween project to production
```

Claude will:
1. Find your project ID
2. Trigger a production deployment
3. Return the deployment URL and status

### Check Deployment Status

```
What's the status of my latest ai-halloween deployment?
```

Claude will:
1. List recent deployments
2. Show the latest deployment status
3. Provide the live URL if ready

### Debug Failed Deployment

```
My ai-halloween deployment failed. Show me the logs.
```

Claude will:
1. Find the failed deployment
2. Retrieve build logs
3. Help identify the issue

### Manage Environment Variables

```
Add a new environment variable VITE_NEW_FEATURE=true to ai-halloween for preview and development environments
```

Claude will:
1. Create the environment variable
2. Set it for the specified environments
3. Confirm the change

### Monitor All Projects

```
Show me all my Vercel projects and their latest deployment status
```

Claude will:
1. List all projects
2. Show latest deployment for each
3. Highlight any issues

## Troubleshooting

### "VERCEL_TOKEN environment variable is required"

**Solution:** 
- Ensure you've added the `VERCEL_TOKEN` to your Claude Desktop config
- Verify the token hasn't expired
- Check that the token has the correct permissions

### "Vercel API error (401)"

**Solution:**
- Your token is invalid or expired
- Generate a new token from [Vercel Account Settings](https://vercel.com/account/tokens)
- Update your Claude Desktop config

### "Project not found"

**Solution:**
- Use `list_projects` to see available projects
- Check the project name spelling
- Verify you have access to the project

### Server Not Showing in Claude Desktop

**Solution:**
1. Check that the path in `claude_desktop_config.json` is absolute
2. Verify the server built successfully (`npm run build`)
3. Restart Claude for Desktop completely (Quit and reopen)
4. Check Claude's logs: `~/Library/Logs/Claude/mcp*.log` (macOS)

### Build Errors

**Solution:**
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Security Best Practices

1. **Never commit your Vercel token** to version control
2. **Use encrypted environment variables** for sensitive data
3. **Rotate tokens regularly** (every 90 days recommended)
4. **Use scoped tokens** if you don't need full account access
5. **Monitor token usage** in Vercel dashboard
6. **Revoke unused tokens** immediately

## Development

### Run in Development Mode

```bash
npm run dev
```

### Testing the Server

```bash
# Test with a simple MCP client
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

### Debugging

The server logs errors to `stderr`. To see debug output:

```bash
VERCEL_TOKEN="your_token" node dist/index.js 2> debug.log
```

## API Rate Limits

Vercel API has rate limits:
- **20 requests per second** per token
- **100 requests per minute** per token

The server doesn't implement rate limiting, so be mindful of rapid successive calls.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Support

- **Documentation**: [Vercel API Docs](https://vercel.com/docs/rest-api)
- **MCP Specification**: [Model Context Protocol](https://modelcontextprotocol.io)
- **Issues**: Open an issue in this repository

## Related Projects

- [Supabase MCP Server](../supabase-mcp-server) - Manage Supabase projects
- [Stripe MCP Server](../stripe-mcp-server) - Manage Stripe payments
- [AI Halloween Transform](../) - The main application

---

Built with ❤️ for the MCP ecosystem