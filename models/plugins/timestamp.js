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
