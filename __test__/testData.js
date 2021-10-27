import { ottoman, SearchConsistency } from '../db/ottomanConnection'

export const bucketName = process.env.CB_BUCKET
export const username = process.env.B_USER
export const password = process.env.CB_PASS
export const connectionString = process.env.CB_URL;
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
