import mongoose from "mongoose";
import timestampPlugin from "./plugins/timestamp.js";

const permissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "app_module",
    },
  ],
});

permissionSchema.plugin(timestampPlugin);

const Permission = mongoose.model("permission", permissionSchema);

export default Permission;
