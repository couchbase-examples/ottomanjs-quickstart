import request from 'supertest'
import { describe, test, expect } from '@jest/globals'
import bcrypt from 'bcryptjs'
import { getOttomanInstances, getDefaultInstance, Ottoman } from '../db/ottomanConnection'
import { app } from '../src/app'

module.exports = {
  request, describe, test, expect,                   //supertes
  bcrypt,                                            // utilities
  getOttomanInstances, getDefaultInstance, Ottoman,  // ottoman
  app                                                // REST application
}
