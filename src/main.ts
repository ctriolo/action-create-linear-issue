import * as core from "@actions/core";
import { LinearClient } from "@linear/sdk";
import createAttachment from "./createAttachment";
import createIssue from "./createIssue";
import getTeamByKey from "./getTeamByKey";

const main = async () => {
  try {
    const apiKey = core.getInput("linear-api-key");
    const linearClient = new LinearClient({ apiKey });

    // Get team object from linear-team-key
    const teamKey = core.getInput("linear-team-key");
    const team = await getTeamByKey(linearClient, teamKey);
    if (!team) {
      core.setFailed(`Failed to find team with key: ${teamKey}`);
      return;
    }
    core.setOutput("linear-team-id", team.id);
    core.setOutput("linear-team-key", team.key);

    // Create issue object from linear-team-key
    const issueTitle = core.getInput("linear-issue-title");
    const issueDescription = core.getInput("linear-issue-description");
    const issue = await createIssue(linearClient, {
      teamId: team.id,
      title: issueTitle,
      description: issueDescription,
    });
    if (!issue) {
      core.setFailed(
        `Failed to create issue with team id: ${team.id} and issue title: ${issueTitle}`
      );
      return;
    }
    console.log(`Created issue with identifier: ${issue.identifier}`);
    console.log(issue.url);
    core.setOutput("linear-issue-id", issue.id);
    core.setOutput("linear-issue-title", issue.title);
    core.setOutput("linear-issue-identifier", issue.identifier);
    core.setOutput("linear-issue-url", issue.url);

    // Create issue object from linear-attachment-url
    const attachmentTitle = core.getInput("linear-attachment-title");
    const attachmentUrl = core.getInput("linear-attachment-url");
    if (attachmentUrl) {
      const attachment = await createAttachment(linearClient, {
        issueId: issue.id,
        url: attachmentUrl,
        title: attachmentTitle || attachmentUrl,
      });
      if (attachment) {
        core.setOutput("linear-attachment-id", attachment?.id);
      } else {
        core.setFailed(`Failed to create Linear URL attachment.`);
        return;
      }
    }
  } catch (error) {
    core.setFailed(`${(error as any)?.message ?? error}`);
  }
};

main();
