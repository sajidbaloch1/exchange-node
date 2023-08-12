import { defaultModules } from "../../lib/helpers/permissions.js";
import AppModule from "../../models/v1/AppModule.js";

export default async function appModulesSeeder() {
  const seeder = {
    name: "App Module",
    hasSeeded: false,
    error: "",
  };

  try {
    const newModules = [];

    for (const { name, key } of defaultModules) {
      const keyExists = await AppModule.findOne({ key: key });
      if (!keyExists) {
        newModules.push({ name, key });
      }
    }

    if (newModules.length) {
      await AppModule.create(newModules);
      seeder.hasSeeded = true;
    }
  } catch (e) {
    seeder.error = e.message;
  }

  return seeder;
}
