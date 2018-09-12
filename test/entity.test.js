import chai from 'chai'
import fs from 'fs'
import Entity from '../src/entity'

const expect = chai.expect

const db = {
  users: [
    { uuid: 'a1b2c3', username: 'joel' },
    { uuid: 'd4e5f6', username: 'aline' }
  ],
  products: [
    { uuid: 'a1b2c3', username: 'tv' },
    { uuid: 'd4e5f6', username: 'laptop' }
  ]
}

/* eslint-env mocha */
describe('Entity', () => {
  beforeEach(() => {
    fs.writeFileSync('../db.json', JSON.stringify(db), 'utf8')
  })

  it('is a class', () => {
    expect(Entity).to.be.a('function')
    expect(new Entity({ dbPath: '../db.json' })).to.be.a.instanceof(Entity)
  })

  it('requires a parameter dbPath', () => {
    expect(() => new Entity()).to.throw()
    expect(() => new Entity({ dbPath: '../db.json' })).to.not.throw()
  })

  it('create()', () => {
    const entity = new Entity({ dbPath: '../db.json' })
    const newEntity = entity.create({
      table: 'users',
      entity: {
        username: 'lucas'
      }
    })

    expect(newEntity.uuid).to.not.equal(undefined)
    expect(newEntity.uuid).to.be.a('string')

    const foundEntity = entity.read({ table: 'users', uuid: newEntity.uuid })

    expect(newEntity.uuid).to.equal(foundEntity.uuid)
    expect(newEntity.username).to.equal(foundEntity.username)
  })

  it('read()', () => {
    const entity = new Entity({ dbPath: '../db.json' })
    const joel = entity.read({ table: 'users', uuid: 'a1b2c3' })

    expect(joel.username).to.equal('joel')
  })

  it('update()', () => {
    const entity = new Entity({ dbPath: '../db.json' })
    const entityForUpdate = entity.read({ table: 'users', uuid: 'a1b2c3' })
    entityForUpdate.name = 'joel wallis'
    entity.update({
      table: 'users',
      uuid: entityForUpdate.uuid,
      entity: entityForUpdate
    })
    const updatedEntity = entity.read({ table: 'users', uuid: 'a1b2c3' })
    expect(entityForUpdate.uuid).to.equal(updatedEntity.uuid)
    expect(entityForUpdate.username).to.equal(updatedEntity.username)
    expect(entityForUpdate.name).to.equal(updatedEntity.name)
  })

  it('delete()', () => {
    const entity = new Entity({ dbPath: '../db.json' })
    const entityForDelete = entity.read({ table: 'users', uuid: 'a1b2c3' })
    entity.delete({
      table: 'users',
      uuid: entityForDelete.uuid
    })
    const deletedEntity = entity.read({ table: 'users', uuid: 'a1b2c3' })
    expect(deletedEntity).to.equal(undefined)
  })
})
