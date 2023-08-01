import BetCategory, { DEFAULT_CATEGORIES } from "../../../models/v1/BetCategory.js";

export default async function betCategorySeeder() {
  const seeder = {
    name: "Bet Category Module",
    hasSeeded: false,
    error: "",
  };

  try {
    for (const betCategory of DEFAULT_CATEGORIES) {
      const regex = new RegExp(`^${betCategory}$`, "i"); // Case-insensitive regex
      var checkCategory = await BetCategory.findOne({ name: { $regex: regex } });
      if (!checkCategory) {
        await BetCategory.create({ name: betCategory });
      }
    }
  } catch (e) {
    seeder.error = e.message;
  }

  return seeder;
}
