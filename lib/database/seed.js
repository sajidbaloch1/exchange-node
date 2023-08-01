import chalk from "chalk";
import appModulesSeeder from "./seeders/appModulesSeeder.js";
import betCategorySeeder from "./seeders/betcategorySeeder.js";

/**
 * Logs the results of the seeding process.
 * @param {Array<Object>} seeders - The array of seeders.
 */
function logSeeds(seeders) {
  console.log(chalk.yellow("\nSeeding database...\n"));

  seeders.forEach((seeder) => {
    if (seeder?.hasSeeded) {
      console.log(`${chalk.green("Success")} ${seeder?.name} seeded`);
    } else if (seeder?.error) {
      console.log(`${chalk.red("Failed")} ${seeder?.name} Error: ${seeder.error}`);
    }
  });

  console.log(chalk.yellow("\nDatabase seeded successfully.\n"));
}

/**
 * Performs database seeding.
 * @async
 * @param {Object} options - The seeding options.
 * @param {boolean} [options.verbose=false] - Indicates whether to log detailed information about the seeding process.
 * @returns {Promise<void>} A Promise that resolves when the seeding process is complete.
 */
export default async function seed({ verbose = false }) {
  Promise.all([appModulesSeeder(), betCategorySeeder()])
    .then((seeders) => {
      const hasSeeders = seeders.find((seeder) => seeder.hasSeeded || seeder.error);

      if (verbose && hasSeeders) {
        logSeeds(seeders);
      }
    })
    .catch((e) => console.log(chalk.red(`Failed to seed database: ${e.message}`)));
}
