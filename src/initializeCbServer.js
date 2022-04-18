import qs from 'qs'
import axios from 'axios'

import { delay } from './delay.js'

var username = process.env.CB_USER
var password = process.env.CB_PASS
var auth = `Basic ${Buffer.from(username + ':' + password).toString('base64')}`

const restCreateBucket = async() => {
  const data = { name: process.env.CB_BUCKET, ramQuotaMB: 150 }
  await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': auth },
    data: qs.stringify(data),
    url: 'http://127.0.0.1:8091/pools/default/buckets',
  })
  .catch((error) => {
    if (error.response === undefined) {
      console.error("Error Creating Bucket:", error.code);
    } else if (error.response.data.errors && error.response.data.errors.name) {
      console.error("Error Creating Bucket:", error.response.data.errors.name, "\n");
    } else if (error.response.data.errors && error.response.data.errors.ramQuota) {
      console.error("Error Creating Bucket:", error.response.data.errors.ramQuota);
      console.log("Try deleting other buckets or increasing cluster size. \n");
    } else if (error.response.data.errors) {
      console.error("Error Creating Bucket: ");
      console.error(error.response.data.errors, "\n");
    } else {
      console.error("Error Creating Bucket:", error.message);
    }
  })
}

/*
  Ottoman will create it's own collections based on your code, we will setup this anyways.
  There is no harm in Ottoman having this collection already setup before it ever interacts with the DB
  If it did not exists Ottoman would go ahead and create it because we specify a collection of the same name
  in the profile-model document.
  */
const restCreateCollection = async() => {
  const data = { name: 'profile' }
  await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': auth },
    data: qs.stringify(data),
    url: `http://127.0.0.1:8091/pools/default/buckets/${process.env.CB_BUCKET}/scopes/_default/collections`
  })
  .catch((error) => {
    if (error.response === undefined) {
      console.error("Error Creating Collection:", error.code);
    } else if (error.response.status === 404) {
      console.error(`Error Creating Collection: bucket \'${process.env.CB_BUCKET}\' not found. \n`)
    } else {
      console.log(`Collection may already exist: ${error.message} \n`)
    }
  })
}

const initializeBucketAndCollection = async() => {
  await restCreateBucket()
  await delay(process.env.DELAY)
  await restCreateCollection()
  await delay(process.env.DELAY)
  console.log("## initiaize db script end ##")
}

initializeBucketAndCollection()

