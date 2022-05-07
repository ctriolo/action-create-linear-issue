import core from "@actions/core";
import linear, { Attachment, Issue, LinearClient } from "@linear/sdk";

/**
 * Creates an issue using the provided issue id and github action inputs
 * @param linearClient LinearClient instance
 * @param issueId Issue to attach the URL to
 * @returns The newly created issue
 */
const createIssue = async (
  linearClient: LinearClient
): Promise<Issue | null> => {
  const teamId = core.getInput("linear-team-id");
  const issueTitle = core.getInput("linear-issue-title");
  const issueDescription = core.getInput("linear-issue-description");
  const issuePayload = await linearClient.issueCreate({
    teamId,
    title: issueTitle,
    description: issueDescription,
  });

  if (!issuePayload.success) {
    core.setFailed(
      `Failed to create issue with team id: ${teamId} and issue title: ${issueTitle}`
    );
    return null;
  }

  const issue = await issuePayload.issue;
  if (!issue) {
    core.setFailed(`Failed to load recently created linear issue.`);
    return null;
  }

  core.setOutput("linear-issue-id", issue.id);
  core.setOutput("linear-issue-title", issue.title);
  core.setOutput("linear-issue-identifier", issue.identifier);
  core.setOutput("linear-issue-url", issue.url);

  return await issue;
};

/**
 * Creates an attachment using the provided issue id and github action inputs
 * @param linearClient LinearClient instance
 * @param issueId Issue to attach the URL to
 * @returns The newly created attachment
 */
const createAttachment = async (
  linearClient: LinearClient,
  issueId: string
): Promise<Attachment | null> => {
  const attachmentTitle = core.getInput("linear-attachment-title");
  const attachmentUrl = core.getInput("linear-attachment-url");

  if (!attachmentUrl) {
    return null;
  }

  const attachmentPayload = await linearClient.attachmentCreate({
    issueId,
    title: attachmentTitle || "",
    url: attachmentUrl,
  });

  if (!attachmentPayload.success) {
    core.setFailed(`Failed to create Linear URL attachment.`);
    return null;
  }

  const attachment = await attachmentPayload.attachment;
  if (!attachment) {
    core.setFailed(`Failed to load recently created Linear URL attachment.`);
    return null;
  }

  return attachment;
};

const main = async () => {
  try {
    const apiKey = core.getInput("linear-api-key");
    const linearClient = new linear.LinearClient({ apiKey });

    const issue = await createIssue(linearClient);
    if (!issue) {
      return;
    }

    await createAttachment(linearClient, issue.id);
  } catch (error) {
    core.setFailed(`${(error as any)?.message ?? error}`);
  }
};

main();
