import { Schema, arrayOf } from 'normalizr'

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr
const sessionUserSchema = new Schema('session');
const userSchema = new Schema('users');
const datasetSchema = new Schema('datasets');
// const schemaSchema = new Schema('schemas');
const querySchema = new Schema('queries');
const resultSchema = new Schema('results', {
  idAttribute : (result) => "result"
});
const migrationSchema = new Schema('migrations');
const changeSchema = new Schema('changes');

datasetSchema.define({
  owner: userSchema
});

// Schemas for Github API responses.
const Schemas = {
  SESSION_USER : sessionUserSchema,
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  DATASET : datasetSchema,
  DATASET_ARRAY : arrayOf(datasetSchema),
  MIGRATION : migrationSchema,
  MIGRATION_ARRAY : arrayOf(migrationSchema),
  CHANGE : changeSchema,
  CHANGE_ARRAY : arrayOf(changeSchema),
  QUERY : querySchema,
  QUERY_ARRAY: arrayOf(querySchema),
  RESULT : resultSchema
}

export default Schemas