import inquirer from "inquirer";
import chalk from "chalk";
import { calculateTip } from "./fuzzy-logic";
import type { Input } from "./interface";

async function main() {
  const input: Input = await inquirer.prompt([
    {
      type: "number",
      name: "serviceQuality",
      message: "Rate the service quality (0-10):",
      validate: (input: number) =>
        (input >= 0 && input <= 10) ||
        "Please enter a number between 0 and 10.",
    },
    {
      type: "number",
      name: "foodQuality",
      message: "Rate the food quality (0-10):",
      validate: (input: number) =>
        (input >= 0 && input <= 10) ||
        "Please enter a number between 0 and 10.",
    },
  ]);

  const tipPercentage = calculateTip(input);

  console.log(chalk.green(`Suggested Tip: ${tipPercentage}%`));
}

main();
