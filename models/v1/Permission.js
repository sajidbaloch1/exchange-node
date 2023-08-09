import mongoose from "mongoose";
import timestampPlugin from "../plugins/timestamp.js";

const permissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

  modules: [
    new mongoose.Schema({
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "appModule", required: true },

      isActive: { type: Boolean, default: false },

      subModules: [
        new mongoose.Schema({
          moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "appModule", required: true },

          isActive: { type: Boolean, default: false },
        }),
      ],
    }),
  ],
});

permissionSchema.plugin(timestampPlugin);

permissionSchema.index({ userId: 1 });
permissionSchema.index({ userId: 1, moduleId: 1 });
permissionSchema.index({ userId: 1, "subModules.moduleId": 1 });

const Permission = mongoose.model("permission", permissionSchema);

export default Permission;
