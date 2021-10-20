import request from 'supertest'
import { describe, test, expect } from '@jest/globals'

import bcrypt from 'bcryptjs'
import { app } from '../src/app'

import { cluster, profileCollection } from '../db/couchbaseConnection'

module.exports = {
  request, describe, test, expect, //supertes
  bcrypt,                          // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
}
