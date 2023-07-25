import mongoose from "mongoose";
import softDeletePlugin from "../plugins/soft-delete.js";
import timestampPlugin from "../plugins/timestamp.js";

const competitionSchema = new mongoose.Schema({
  // Name of the competition
  name: {
    type: String,
    required: true,
  },
  // Reference to the sport associated with this competition
  sportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sport",
    required: [true, "Sport is Required"],
  },
  // API identifier for the sport (if applicable)
  apiSportId: {
    type: Number,
    default: null
  },
  // Date when the competition was created
  createdOn: {
    type: Date,
    required: true,
  },
  // Indicates if the competition is currently active or not
  isActive: {
    type: Boolean,
    default: true,
  },
  // Indicates if the competition is manually created (as opposed to being imported from an external API)
  isManual: {
    type: Boolean,
    default: false,
  },
  // Number of markets available for this competition (default is 0)
  marketCount: {
    type: Number,
    default: 0,
  },
  // Region or location associated with this competition
  competitionRegion: {
    type: String,
  },
});

competitionSchema.plugin(timestampPlugin);
competitionSchema.plugin(softDeletePlugin);

const Competition = mongoose.model("competition", competitionSchema);

export default Competition;
