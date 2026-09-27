import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  INodeProperties,
} from "n8n-workflow";
import { NodeConnectionTypes } from "n8n-workflow";
import { executeOperations, type Operation } from "./transport";
import operations from "./operations.json";
import properties from "./properties.json";

export class Demovela implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Demovela",
    name: "demovela",
    icon: { light: "file:demovela.svg", dark: "file:demovela.svg" },
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Automate your Demovela account",
    defaults: { name: "Demovela" },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [{ name: "demovelaOAuth2Api", required: true }],
    properties: properties as INodeProperties[],
  };
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return executeOperations(
      this,
      "https://mcp.demovela.com/mcp",
      "demovelaOAuth2Api",
      operations as unknown as Operation[],
    );
  }
}
