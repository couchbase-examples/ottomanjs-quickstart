import { ottoman, SearchConsistency } from '../db/ottomanConnection'

export const bucketName = process.env.DB_BUCKET_NAME
export const username = process.env.DB_USERNAME
export const password = process.env.DB_PASSWORD
export const connectionString = process.env.DB_CONN_STR;
export const connectUri = `${connectionString}/${bucketName}@${username}:${password}`;

export const delay = (timems) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timems);
  });

export const startInTest = async () => {
  await ottoman.start();
  return true;
};

export const consistency = { consistency: SearchConsistency.LOCAL };
