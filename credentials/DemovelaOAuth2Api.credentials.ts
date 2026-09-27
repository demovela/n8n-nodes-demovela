import type { ICredentialType, INodeProperties } from "n8n-workflow";

export class DemovelaOAuth2Api implements ICredentialType {
  name = "demovelaOAuth2Api";
  displayName = "Demovela OAuth2 API";
  documentationUrl =
    "https://github.com/demovela/n8n-nodes-demovela#authentication";
  icon = { light: "file:demovela.svg", dark: "file:demovela.svg" } as const;
  extends = ["oAuth2Api"];
  properties: INodeProperties[] = [
    {
      displayName: "Use Dynamic Client Registration",
      name: "useDynamicClientRegistration",
      type: "hidden",
      default: true,
    },
    {
      displayName: "Server URL",
      name: "serverUrl",
      type: "hidden",
      default: "https://mcp.demovela.com/mcp",
    },
    {
      displayName: "Resource URL",
      name: "resourceUrl",
      type: "hidden",
      default: "https://mcp.demovela.com/mcp",
    },
  ];
}
