// cli.ts
import inquirer from "inquirer";
import BlockSortApi from "./block-sort-api/BlockSortApi";
import mapApiLevelState from "./mapping/mapApiLevelState";
import { getValidMoves } from "./domain/helpers/getValidMoves";

async function main(): Promise<void> {
  const api = new BlockSortApi();

  let exit = false;
  while (!exit) {
    console.log("Waiting for level state...");
    const apiLevelState = await api.getLevelState();
    const levelState = mapApiLevelState(apiLevelState);
    const validMoves = getValidMoves(levelState);

    console.log("Found level state:\n");
    console.log({ validMoves });

    const { command } = await inquirer.prompt([
      {
        type: "list",
        name: "command",
        message: "Select a command:",
        choices: ["Start Process", "Interrupt Process", "Exit"],
      },
    ]);

    if (command === "Exit") {
      exit = true;
      continue;
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
});
