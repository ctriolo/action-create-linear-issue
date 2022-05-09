import { setFailed, getInput, setOutput } from "@actions/core";
import { LinearClient } from "@linear/sdk";
import createAttachment from "./createAttachment";
import createIssue from "./createIssue";
import getTeamByKey from "./getTeamByKey";

const main = async () => {
  try {
    const apiKey = getInput("linear-api-key");
    const linearClient = new LinearClient({ apiKey });

    // Get team object from linear-team-key
    const teamKey = getInput("linear-team-key");
    const team = await getTeamByKey(linearClient, teamKey);
    if (!team) {
      setFailed(`Failed to find team with key: ${teamKey}`);
      return;
    }

    // Create issue object from linear-team-key
    const issueTitle = getInput("linear-issue-title");
    const issueDescription = getInput("linear-issue-description");
    const issue = await createIssue(linearClient, {
      teamId: team.id,
      title: issueTitle,
      description: issueDescription,
    });
    if (!issue) {
      setFailed(
        `Failed to create issue with team id: ${team.id} and issue title: ${issueTitle}`
      );
      return;
    }

    // Set issue properties as output
    console.log(`Created issue with identifier: ${issue.identifier}`);
    console.log(issue.url);
    setOutput("linear-team-id", team.id);
    setOutput("linear-team-key", team.key);
    setOutput("linear-issue-id", issue.id);
    setOutput("linear-issue-number", issue.number);
    setOutput("linear-issue-identifier", issue.identifier);
    setOutput("linear-issue-url", issue.url);
    setOutput("linear-issue-title", issue.title);
    setOutput("linear-issue-description", issue.description);

    // Create issue object from linear-attachment-url
    const attachmentTitle = getInput("linear-attachment-title");
    const attachmentUrl = getInput("linear-attachment-url");
    if (attachmentUrl) {
      const attachment = await createAttachment(linearClient, {
        issueId: issue.id,
        url: attachmentUrl,
        title: attachmentTitle || attachmentUrl,
      });
      if (attachment) {
        setOutput("linear-attachment-id", attachment?.id);
      } else {
        setFailed(`Failed to create Linear URL attachment.`);
        return;
      }
    }
  } catch (error) {
    setFailed(`${(error as any)?.message ?? error}`);
  }
};

main();
