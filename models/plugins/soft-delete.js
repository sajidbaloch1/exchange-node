export default function softDeletePlugin(schema) {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  schema.methods.softDelete = function (cb) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.save(cb);
  };

  schema.method(
    "remove",
    function (cb) {
      this.softDelete(cb);
    },
    { suppressWarning: true }
  );
}
