import { Issue, LinearClient } from "@linear/sdk";

/**
 * Creates an issue using the provided issue id and github action inputs
 * @param linearClient LinearClient instance
 * @param input Required input to pass to issueCreate
 * @returns The newly created issue
 */
const createIssue = async (
  linearClient: LinearClient,
  input: {
    teamId: string;
    title: string;
    description: string;
    stateId?: string;
    labelIds?: string[];
    projectId?: string;
  }
): Promise<Issue | null> => {
  const issuePayload = await linearClient.issueCreate(input);

  if (!issuePayload.success) {
    return null;
  }

  const issue = await issuePayload.issue;

  if (!issue) {
    return null;
  }

  return issue;
};

export default createIssue;
