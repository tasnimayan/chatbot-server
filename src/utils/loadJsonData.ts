import { AppData, NodeObject, Action, Trigger, Response, ResourceTemplate, AuthToken } from "../types";
import { parseJsonFile } from ".";

// Load all data from JSON files
function loadJsonData(): AppData {
  console.log("Loading data from JSON files...");

  const data: AppData = {
    nodes: parseJsonFile<NodeObject>("node.json"),
    actions: parseJsonFile<Action>("action.json"),
    triggers: parseJsonFile<Trigger>("trigger.json"),
    responses: parseJsonFile<Response>("response.json"),
    resourceTemplates: parseJsonFile<ResourceTemplate>("resourceTemplate.json"),
    tokens: parseJsonFile<AuthToken>("tokens.json"),
  };

  return data;
}

export { loadJsonData };
