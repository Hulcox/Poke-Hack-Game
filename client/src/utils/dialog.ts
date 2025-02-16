export const dialogTemplates = {
  attackerTurn: (name: string, username: string) =>
    `It's ${name} of ${username}'s turn to attack!!`,
  attack: (name: string, username: string) => `${name} of ${username} attacks`,
  fainted: "Your pokemon has fainted, you need to switch pokemon.",
  switch: (from: string, to: string) => `${from} is switching with ${to}`,
  enterBattle: (name: string) => `${name} enters the battle`,
  ko: (name: string, username: string) => `${name} of ${username} is KO!`,
  hackNotResolve: "You don't resolve the hack",
};
