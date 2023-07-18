import mongoose from "mongoose";
import timestampPlugin from "./plugins/timestamp.js";

const permissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  modules: [
    new mongoose.Schema({
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "app_module",
        required: true,
      },
      active: { type: Boolean, required: true },
    }),
  ],
});

permissionSchema.plugin(timestampPlugin);

permissionSchema.index({ userId: 1 });
permissionSchema.index({ "modules.moduleId": 1 });

const Permission = mongoose.model("permission", permissionSchema);

export default Permission;
