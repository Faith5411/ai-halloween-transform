#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Vercel API configuration
const VERCEL_API_BASE = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  console.error('Error: VERCEL_TOKEN environment variable is required');
  process.exit(1);
}

// Helper function to make Vercel API requests
async function makeVercelRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<any> {
  const url = `${VERCEL_API_BASE}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vercel API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// Tool definitions
const tools: Tool[] = [
  {
    name: 'list_projects',
    description:
      'List all Vercel projects in your account. Returns project names, IDs, and basic metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of projects to return (default: 20)',
          default: 20,
        },
      },
    },
  },
  {
    name: 'get_project',
    description:
      'Get detailed information about a specific Vercel project including settings, environment variables, and latest deployment.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'list_deployments',
    description:
      'List deployments for a project. Shows deployment status, URLs, and timestamps.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of deployments to return (default: 10)',
          default: 10,
        },
        target: {
          type: 'string',
          description: 'Filter by deployment target',
          enum: ['production', 'preview', 'development'],
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'get_deployment',
    description:
      'Get detailed information about a specific deployment including build logs, status, and metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        deploymentId: {
          type: 'string',
          description: 'Deployment ID or URL',
        },
      },
      required: ['deploymentId'],
    },
  },
  {
    name: 'create_deployment',
    description:
      'Trigger a new deployment for a project. This redeploys the latest commit from the connected Git repository.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
        target: {
          type: 'string',
          description: 'Deployment target (default: preview)',
          enum: ['production', 'preview'],
          default: 'preview',
        },
        gitSource: {
          type: 'object',
          description: 'Git source information (branch, commit SHA)',
          properties: {
            ref: {
              type: 'string',
              description: 'Git branch or ref to deploy',
            },
            sha: {
              type: 'string',
              description: 'Git commit SHA to deploy',
            },
          },
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'cancel_deployment',
    description: 'Cancel a running deployment.',
    inputSchema: {
      type: 'object',
      properties: {
        deploymentId: {
          type: 'string',
          description: 'Deployment ID to cancel',
        },
      },
      required: ['deploymentId'],
    },
  },
  {
    name: 'get_deployment_logs',
    description:
      'Get build and runtime logs for a deployment. Useful for debugging failed deployments.',
    inputSchema: {
      type: 'object',
      properties: {
        deploymentId: {
          type: 'string',
          description: 'Deployment ID',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of log entries to return (default: 100)',
          default: 100,
        },
      },
      required: ['deploymentId'],
    },
  },
  {
    name: 'list_env_variables',
    description:
      "List environment variables for a project. Shows variable names, values, and which environments they're used in.",
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'create_env_variable',
    description:
      'Create a new environment variable for a project. You can specify which environments (production, preview, development) should use this variable.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
        key: {
          type: 'string',
          description: "Environment variable name (e.g., 'VITE_API_KEY')",
        },
        value: {
          type: 'string',
          description: 'Environment variable value',
        },
        target: {
          type: 'array',
          description: 'Environments where this variable should be available',
          items: {
            type: 'string',
            enum: ['production', 'preview', 'development'],
          },
          default: ['production', 'preview', 'development'],
        },
        type: {
          type: 'string',
          description: 'Variable type',
          enum: ['plain', 'secret', 'encrypted'],
          default: 'encrypted',
        },
      },
      required: ['projectId', 'key', 'value'],
    },
  },
  {
    name: 'update_env_variable',
    description: 'Update an existing environment variable.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
        envId: {
          type: 'string',
          description: 'Environment variable ID',
        },
        value: {
          type: 'string',
          description: 'New value for the environment variable',
        },
        target: {
          type: 'array',
          description: 'Environments where this variable should be available',
          items: {
            type: 'string',
            enum: ['production', 'preview', 'development'],
          },
        },
      },
      required: ['projectId', 'envId', 'value'],
    },
  },
  {
    name: 'delete_env_variable',
    description: 'Delete an environment variable from a project.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
        envId: {
          type: 'string',
          description: 'Environment variable ID to delete',
        },
      },
      required: ['projectId', 'envId'],
    },
  },
  {
    name: 'get_project_domains',
    description: 'List all domains configured for a project.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or project name',
        },
      },
      required: ['projectId'],
    },
  },
];

// Tool handlers
async function handleListProjects(args: any): Promise<string> {
  const { limit = 20 } = args;
  const data = await makeVercelRequest(`/v9/projects?limit=${limit}`);

  if (!data.projects || data.projects.length === 0) {
    return 'No projects found.';
  }

  const projects = data.projects.map((project: any) => ({
    id: project.id,
    name: project.name,
    framework: project.framework || 'N/A',
    createdAt: new Date(project.createdAt).toLocaleString(),
    latestDeployment: project.latestDeployments?.[0]?.url || 'None',
  }));

  return JSON.stringify(projects, null, 2);
}

async function handleGetProject(args: any): Promise<string> {
  const { projectId } = args;
  const data = await makeVercelRequest(`/v9/projects/${projectId}`);

  const summary = {
    id: data.id,
    name: data.name,
    framework: data.framework || 'N/A',
    buildCommand: data.buildCommand || 'Default',
    outputDirectory: data.outputDirectory || 'Default',
    installCommand: data.installCommand || 'Default',
    devCommand: data.devCommand || 'Default',
    createdAt: new Date(data.createdAt).toLocaleString(),
    updatedAt: new Date(data.updatedAt).toLocaleString(),
    latestDeployments: data.latestDeployments?.slice(0, 3).map((d: any) => ({
      url: d.url,
      state: d.state,
      createdAt: new Date(d.createdAt).toLocaleString(),
    })),
  };

  return JSON.stringify(summary, null, 2);
}

async function handleListDeployments(args: any): Promise<string> {
  const { projectId, limit = 10, target } = args;
  let endpoint = `/v6/deployments?projectId=${projectId}&limit=${limit}`;
  if (target) {
    endpoint += `&target=${target}`;
  }

  const data = await makeVercelRequest(endpoint);

  if (!data.deployments || data.deployments.length === 0) {
    return 'No deployments found.';
  }

  const deployments = data.deployments.map((deployment: any) => ({
    id: deployment.uid,
    url: deployment.url,
    state: deployment.state,
    target: deployment.target,
    createdAt: new Date(deployment.createdAt).toLocaleString(),
    ready: deployment.ready,
  }));

  return JSON.stringify(deployments, null, 2);
}

async function handleGetDeployment(args: any): Promise<string> {
  const { deploymentId } = args;
  const data = await makeVercelRequest(`/v13/deployments/${deploymentId}`);

  const summary = {
    id: data.uid,
    name: data.name,
    url: data.url,
    state: data.state,
    type: data.type,
    target: data.target,
    createdAt: new Date(data.createdAt).toLocaleString(),
    buildingAt: data.buildingAt
      ? new Date(data.buildingAt).toLocaleString()
      : null,
    ready: data.ready,
    readyState: data.readyState,
    creator: data.creator?.username || 'N/A',
    meta: data.meta,
  };

  return JSON.stringify(summary, null, 2);
}

async function handleCreateDeployment(args: any): Promise<string> {
  const { projectId, target = 'preview', gitSource } = args;

  const body: any = {
    name: projectId,
    target,
  };

  if (gitSource) {
    body.gitSource = gitSource;
  }

  const data = await makeVercelRequest(`/v13/deployments`, 'POST', body);

  return JSON.stringify(
    {
      id: data.uid,
      url: data.url,
      state: data.state,
      target: data.target,
      message: 'Deployment created successfully!',
    },
    null,
    2
  );
}

async function handleCancelDeployment(args: any): Promise<string> {
  const { deploymentId } = args;
  await makeVercelRequest(`/v12/deployments/${deploymentId}/cancel`, 'PATCH');
  return `Deployment ${deploymentId} has been cancelled.`;
}

async function handleGetDeploymentLogs(args: any): Promise<string> {
  const { deploymentId, limit = 100 } = args;
  const data = await makeVercelRequest(
    `/v2/deployments/${deploymentId}/events?limit=${limit}`
  );

  if (!data || data.length === 0) {
    return 'No logs found for this deployment.';
  }

  const logs = data.slice(0, limit).map((log: any) => ({
    timestamp: new Date(log.created).toLocaleString(),
    type: log.type,
    payload:
      log.payload?.text || log.payload?.message || JSON.stringify(log.payload),
  }));

  return JSON.stringify(logs, null, 2);
}

async function handleListEnvVariables(args: any): Promise<string> {
  const { projectId } = args;
  const data = await makeVercelRequest(`/v9/projects/${projectId}/env`);

  if (!data.envs || data.envs.length === 0) {
    return 'No environment variables found.';
  }

  const envs = data.envs.map((env: any) => ({
    id: env.id,
    key: env.key,
    value: env.type === 'secret' ? '[SECRET]' : env.value,
    type: env.type,
    target: env.target,
    createdAt: new Date(env.createdAt).toLocaleString(),
    updatedAt: new Date(env.updatedAt).toLocaleString(),
  }));

  return JSON.stringify(envs, null, 2);
}

async function handleCreateEnvVariable(args: any): Promise<string> {
  const {
    projectId,
    key,
    value,
    target = ['production', 'preview', 'development'],
    type = 'encrypted',
  } = args;

  const body = {
    key,
    value,
    type,
    target,
  };

  const data = await makeVercelRequest(
    `/v10/projects/${projectId}/env`,
    'POST',
    body
  );

  return JSON.stringify(
    {
      id: data.id,
      key: data.key,
      target: data.target,
      message: 'Environment variable created successfully!',
    },
    null,
    2
  );
}

async function handleUpdateEnvVariable(args: any): Promise<string> {
  const { projectId, envId, value, target } = args;

  const body: any = { value };
  if (target) {
    body.target = target;
  }

  await makeVercelRequest(
    `/v9/projects/${projectId}/env/${envId}`,
    'PATCH',
    body
  );

  return `Environment variable ${envId} updated successfully!`;
}

async function handleDeleteEnvVariable(args: any): Promise<string> {
  const { projectId, envId } = args;
  await makeVercelRequest(`/v9/projects/${projectId}/env/${envId}`, 'DELETE');
  return `Environment variable ${envId} deleted successfully!`;
}

async function handleGetProjectDomains(args: any): Promise<string> {
  const { projectId } = args;
  const data = await makeVercelRequest(`/v9/projects/${projectId}/domains`);

  if (!data.domains || data.domains.length === 0) {
    return 'No domains found for this project.';
  }

  const domains = data.domains.map((domain: any) => ({
    name: domain.name,
    verified: domain.verified,
    redirect: domain.redirect,
    redirectStatusCode: domain.redirectStatusCode,
    gitBranch: domain.gitBranch,
    updatedAt: new Date(domain.updatedAt).toLocaleString(),
  }));

  return JSON.stringify(domains, null, 2);
}

// Main server setup
const server = new Server(
  {
    name: 'vercel-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    let result: string;

    switch (name) {
      case 'list_projects':
        result = await handleListProjects(args);
        break;
      case 'get_project':
        result = await handleGetProject(args);
        break;
      case 'list_deployments':
        result = await handleListDeployments(args);
        break;
      case 'get_deployment':
        result = await handleGetDeployment(args);
        break;
      case 'create_deployment':
        result = await handleCreateDeployment(args);
        break;
      case 'cancel_deployment':
        result = await handleCancelDeployment(args);
        break;
      case 'get_deployment_logs':
        result = await handleGetDeploymentLogs(args);
        break;
      case 'list_env_variables':
        result = await handleListEnvVariables(args);
        break;
      case 'create_env_variable':
        result = await handleCreateEnvVariable(args);
        break;
      case 'update_env_variable':
        result = await handleUpdateEnvVariable(args);
        break;
      case 'delete_env_variable':
        result = await handleDeleteEnvVariable(args);
        break;
      case 'get_project_domains':
        result = await handleGetProjectDomains(args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: 'text', text: result }],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Vercel MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
