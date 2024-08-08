import { sortByConstants, sortOrderConstants } from '../constants/constants.js';
// import createHttpError from 'http-errors';
import Water from '../db/models/Water.js';
import calcPaginationData from '../utils/calcPaginationData.js';

export const getWater = async ({
  page,
  perPage,
  sortBy = sortByConstants[0],
  sortOrder = sortOrderConstants[0],
  filter,
}) => {
  const databaseQuery = Water.find();

  if (filter.userId) {
    databaseQuery.where('userId').equals(filter.userId);
  }

  if (filter.month) {
    databaseQuery.where('month').equals(filter.month);
  }
  if (filter.year) {
    databaseQuery.where('year').equals(filter.year);
  }

  const items = await databaseQuery.sort({ [sortBy]: sortOrder });

  const totalItems = await Water.find().merge(databaseQuery).countDocuments();

  const { totalPages, hasNextPage, hasPreviousPage } = calcPaginationData(
    totalItems,
    page,
    perPage,
  );

  return {
    items,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getWaterById = (filter) => Water.findOne(filter);

export const addWater = (data) => Water.create(data);

export const upsertWater = async (
  filter,
  data,
  options = {},
  // photo,
) => {
  // if (photo) {
  //   data.photo = photo;
  // }
  const result = await Water.findOneAndUpdate(filter, data, {
    new: true,
    runValidators: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  return {
    result,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
};

export const deleteWater = (filter) => Water.findOneAndDelete(filter);
