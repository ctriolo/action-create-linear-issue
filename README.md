# action-create-linear-issue

This is a [Github Action](https://github.com/features/actions) that creates a [Linear](https://linear.app/) Issue.

This is helpful when you're:

- Syncing GitHub Issues to Linear.
- Ensuring each Pull Request has a Linear Issue.
- Creating a Linear Issue off of release.

## Inputs

| Input                      | Description                                                   | Required |
| -------------------------- | ------------------------------------------------------------- | -------- |
| `linear-api-key`           | Linear API key generated from https://linear.app/settings/api | ✅       |
| `linear-team-key`          | Team key (e.g. ENG) for the Linear issue.                     | ✅       |
| `linear-issue-title`       | Title for the Linear issue.                                   | ✅       |
| `linear-issue-description` | Description for the Linear issue.                             | ✅       |
| `linear-issue-state-id`    | Team state ID for the Linear issue.                           |          |
| `linear-attachment-url`    | URL to attach to the Linear issue.                            |          |
| `linear-attachment-title`  | URL to attach to the Linear issue.                            |          |

## Outputs

| Output                     | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `linear-issue-id`          | The Linear issue's unique identifier. (UUID)                 |
| `linear-issue-identifier`  | The Linear issue's human readable identifier. (e.g. ENG-123) |
| `linear-issue-number`      | The Linear issue's number. (e.g. the `123` of `ENG-123`)     |
| `linear-issue-title`       | The Linear issue's title.                                    |
| `linear-issue-description` | The Linear issue's description.                              |
| `linear-issue-url`         | The Linear issue's URL. (e.g. https://...)                   |
| `linear-team-id`           | The Linear team's unique identifier. (UUID)                  |
| `linear-team-key`          | The Linear team's key/prefix (e.g. ENG)                      |
| `linear-attachment-id`     | The Linear attachment's uniquie identifier. (UUID)           |

## Example usage

### Create Linear Issue on Pull Request

```yaml
name: Create Linear Issue on Pull Request

on:
  workflow_dispatch:
  pull_request:
    branches:
      - main
    types: [opened, reopened]

jobs:
  create-linear-issue-on-pull-request:
    runs-on: ubuntu-latest
    steps:
      - name: Create the Linear Issue
        id: createIssue
        uses: ctriolo/action-create-linear-issue@v1
        with:
          linear-api-key: ${{secrets.LINEAR_API_KEY}}
          linear-team-key: "CHR"
          linear-issue-title: ${{github.event.pull_request.title}}
          linear-issue-description: ${{github.event.pull_request.body}}
          linear-attachment-url: ${{github.event.pull_request.html_url}}
          linear-attachment-title: ${{github.event.pull_request.title}}

      - name: Create comment in PR with Linear Issue link
        uses: peter-evans/create-or-update-comment@v2
        with:
          issue-number: ${{ github.event.pull_request.number }}
          body: |
            ${{ steps.createIssue.outputs.linear-issue-url }}"
```
