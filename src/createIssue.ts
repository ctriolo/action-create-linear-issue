import { Issue, LinearClient } from "@linear/sdk";
import { IssueCreateInput } from "@linear/sdk/dist/_generated_documents";

/**
 * Creates an issue using the provided issue id and github action inputs
 * @param linearClient LinearClient instance
 * @param issueId Issue to attach the URL to
 * @returns The newly created issue
 */
const createIssue = async (
  linearClient: LinearClient,
  input: IssueCreateInput
): Promise<Issue | null> => {
  const issuePayload = await linearClient.issueCreate(input);

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
