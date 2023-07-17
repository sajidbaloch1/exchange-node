import AppModule, { APP_MODULES } from "../../../models/AppModule.js";

export default async function appModulesSeeder() {
  const seeder = {
    name: "App Module",
    hasSeeded: false,
    error: "",
  };

  try {
    const newModules = [];
    const appModules = Object.values(APP_MODULES);

    for (const moduleKey of appModules) {
      const keyExists = await AppModule.findOne({
        key: moduleKey.toLowerCase(),
      });

      if (!keyExists) {
        const name =
          moduleKey
            ?.replaceAll("_module", "")
            ?.split("_")
            ?.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            ?.join(" ") || null;

        if (name) {
          newModules.push({ name, key: moduleKey.toLowerCase() });
        }
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
