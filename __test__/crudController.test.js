import express from 'express'
import request from 'supertest'
import { describe, test, expect, beforeEach } from '@jest/globals'
import { makeCrudController } from '../src/shared/crudController'

// In-memory stand-in for an Ottoman model: exercises the CRUD seam without a
// Couchbase cluster.
const makeFakeModel = () => {
  const store = new Map()
  const notFound = (id) => new Error(`document not found: ${id}`)
  class FakeModel {
    constructor(data) {
      Object.assign(this, data)
    }
    async save() {
      store.set(this.id, { ...this })
      return this
    }
    static async findById(id) {
      if (!store.has(id)) throw notFound(id)
      return store.get(id)
    }
    static async replaceById(id, data) {
      if (!store.has(id)) throw notFound(id)
      store.set(id, { ...data })
      return store.get(id)
    }
    static async removeById(id) {
      if (!store.delete(id)) throw notFound(id)
    }
  }
  return { FakeModel, store }
}

describe('makeCrudController', () => {
  let app
  let store

  beforeEach(() => {
    const fake = makeFakeModel()
    store = fake.store
    const { create, read, update, remove } = makeCrudController(fake.FakeModel)
    app = express()
    app.use(express.json())
    app.post('/', create)
    app.get('/:id', read)
    app.put('/', update)
    app.delete('/:id', remove)
  })

  test('create persists a new document and responds 201', async () => {
    const response = await request(app).post('/').send({ id: 'a1', name: 'A' })
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ id: 'a1', name: 'A' })
    expect(store.get('a1')).toEqual({ id: 'a1', name: 'A' })
  })

  test('create responds 409 when the id already exists', async () => {
    store.set('a1', { id: 'a1', name: 'A' })
    const response = await request(app).post('/').send({ id: 'a1', name: 'B' })
    expect(response.statusCode).toBe(409)
    expect(response.body).toEqual({ message: 'Duplicate key error' })
    expect(store.get('a1').name).toBe('A')
  })

  test('read returns the document or 404', async () => {
    store.set('a1', { id: 'a1', name: 'A' })
    expect((await request(app).get('/a1')).body).toEqual({
      id: 'a1',
      name: 'A',
    })
    expect((await request(app).get('/missing')).statusCode).toBe(404)
  })

  test('update replaces the document identified by body.id', async () => {
    store.set('a1', { id: 'a1', name: 'A' })
    const response = await request(app).put('/').send({ id: 'a1', name: 'B' })
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ id: 'a1', name: 'B' })
    expect(store.get('a1').name).toBe('B')
  })

  test('remove deletes the document and responds 204, or 404', async () => {
    store.set('a1', { id: 'a1' })
    expect((await request(app).delete('/a1')).statusCode).toBe(204)
    expect(store.has('a1')).toBe(false)
    expect((await request(app).delete('/a1')).statusCode).toBe(404)
  })
})
