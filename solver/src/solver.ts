// cli.ts
import inquirer from "inquirer";
import BlockSortApi from "./block-sort-api/BlockSortApi";

async function main(): Promise<void> {
  const api = new BlockSortApi();

  let exit = false;
  while (!exit) {
    console.log("Waiting for level state...");
    const levelState = await api.getLevelState();
    console.log("Found level state:\n");
    console.log({ levelState });

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
