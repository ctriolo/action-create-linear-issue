import { LinearClient, Team } from "@linear/sdk";

const getTeamByKey = async (
  linearClient: LinearClient,
  teamKey: string
): Promise<Team | null> => {
  const teams = await linearClient.teams({ filter: { key: { eq: teamKey } } });
  if (teams.nodes.length === 0) {
    return null;
  }

  return teams.nodes[0];
};

export default getTeamByKey;
