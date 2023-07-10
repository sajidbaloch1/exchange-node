export const generatePaginationQueries = (page = null, perPage = null) => {
  let paginationQueries = [];

  if (page && perPage) {
    const limit = perPage;
    const offset = page * perPage - perPage;

    paginationQueries = [{ $skip: offset }, { $limit: limit }];
  }

  return paginationQueries;
};

export const generateSearchFilters = (searchQuery, fields) => {
  const searchFilters = fields.map((field) => {
    return {
      [field]: { $regex: `.*${searchQuery}.*`, $options: "i" },
    };
  });

  return searchFilters;
};
