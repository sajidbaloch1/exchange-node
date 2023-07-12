/**
 * Mongoose plugin that adds timestamp fields to a schema for createdAt and updatedAt.
 *
 * @function timestampPlugin
 * @param {mongoose.Schema} schema - The Mongoose schema to apply the timestamp plugin to.
 * @returns {void}
 */
export default function timestampPlugin(schema) {
  schema.add({
    createdAt: Date,
    updatedAt: Date,
  });

  // Set updatedAt and createdAt
  schema.pre("save", function (next) {
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
    next();
  });
}
