import { ottoman, SearchConsistency } from '../db/ottomanConnection'

export const bucketName = process.env.DB_BUCKET_NAME
export const username = process.env.DB_USERNAME
export const password = process.env.DB_PASSWORD
export const connectionString = process.env.DB_CONN_STR
export const connectUri = `${connectionString}/${bucketName}@${username}:${password}`

export const delay = (timems) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timems)
  })

const runSeed =
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.toUpperCase()
let sequence = 0

const nextToken = () => `${runSeed}${(sequence++).toString(36).toUpperCase()}`

export const testId = (prefix = 'test') => `${prefix}-${nextToken()}`

export const testCode = (prefix = 'TEST') =>
  `${prefix}${nextToken()}`.replace(/[^A-Z0-9]/g, '').slice(0, 16)

export const testName = (prefix = 'Test') => `${prefix} ${nextToken()}`

export const startInTest = async () => {
  await ottoman.start()
  return true
}

export const consistency = { consistency: SearchConsistency.LOCAL }
