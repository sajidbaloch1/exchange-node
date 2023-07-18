// import mongoose from "mongoose";
// import softDeletePlugin from "./plugins/soft-delete.js";
// import timestampPlugin from "./plugins/timestamp.js";

// const betCategorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   }
// });

// betCategorySchema.plugin(timestampPlugin);
// betCategorySchema.plugin(softDeletePlugin);

// const BetCategory = mongoose.model("bet_category", betCategorySchema);

// export default BetCategory;

// const betCategory = "bet_category";
export const BET_CATEGORY = {
  MATCH_ODDS: "match_odds",
  BOOKMAKER: "bookmaker",
  Fancy: "fancy",
  METER: "meter",
  ODD_EVEN: "odd_even",
  OVER_BY_OVER: "over_by_over",
  OVER_UNDER_05: "over_under_0.5",
  OVER_UNDER_15: "over_under_1.5",
  OVER_UNDER_25: "over_under_2.5",
  OVER_UNDER_35: "over_under_3.5",
  OVER_UNDER_45: "over_under_4.5",
  OVER_UNDER_55: "over_under_5.5",
  OVER_UNDER_65: "over_under_6.5",
  OVER_UNDER_75: "over_under_7.5",
  Goals_Odd_Even: "goals_odd_even",
  Draw_yes_no: "draw_yes_no",
};
