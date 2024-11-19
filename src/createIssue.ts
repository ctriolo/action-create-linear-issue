import { Issue, LinearClient } from "@linear/sdk";

/**
 * Creates an issue using the provided issue id and github action inputs
 * @param linearClient LinearClient instance
 * @param issueId Issue to attach the URL to
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
  },
): Promise<Issue | null> => {
  const issuePayload = await linearClient.createIssue(input);

  if (!issuePayload.success) {
    return null;
  }

  const issue = await issuePayload.issue;
  if (!issue) {
    return null;
  }

  return await issue;
};

export default createIssue;
