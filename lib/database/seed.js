import chalk from "chalk";
import appModulesSeeder from "./seeders/appModulesSeeder.js";

function logSeeds(seeders) {
  console.log(chalk.yellow("\nSeeding database...\n"));

  seeders.forEach((seeder) => {
    if (seeder?.hasSeeded) {
      console.log(`${chalk.green("Success")} ${seeder?.name} seeded`);
    } else if (seeder?.error) {
      console.log(
        `${chalk.red("Failed")} ${seeder?.name} Error: ${seeder.error}`
      );
    }
  });

  console.log(chalk.yellow("\nDatabase seeded successfully.\n"));
}

export default async function seed({ verbose = false }) {
  Promise.all([appModulesSeeder()])
    .then((seeders) => {
      const hasSeeders = seeders.find(
        (seeder) => seeder.hasSeeded || seeder.error
      );

      if (verbose && hasSeeders) {
        logSeeds(seeders);
      }
    })
    .catch((e) =>
      console.log(chalk.red(`Failed to seed database: ${e.message}`))
    );
}
