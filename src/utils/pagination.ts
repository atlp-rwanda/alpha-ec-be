export const pagination = <Z>(
  data: Z,
  page: number,
  limit: number,
  name: string = 'products'
) => {
  // eslint-disable @typescript-eslint/no-explicit-any
  const { count: totalItems, rows } = data as { count: number; rows: Z[] };
  const pageNumber = page > 1 ? page : 1;
  const currentPage = pageNumber !== 1 ? +pageNumber : 1;
  const totalPages = Math.ceil(totalItems / limit);
  const from = (currentPage - 1) * limit;
  const to = Math.min(from + limit, totalItems);

  const payload = {
    totalItems,
    [name]: rows,
    totalPages,
    from: currentPage <= totalPages ? from : undefined,
    to: currentPage <= totalPages ? to : undefined,
  };

  return payload;
};
