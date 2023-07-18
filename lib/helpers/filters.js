export const generatePaginationQueries = (page = null, perPage = 10) => {
  let paginationQueries = [];

  if (page) {
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
