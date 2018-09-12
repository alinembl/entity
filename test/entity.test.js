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
    expect(new Entity({ dbPath: './db.json' })).to.be.a.instanceof(Entity)
  })

  it('requires a parameter dbPath', () => {
    expect(() => new Entity()).to.throw()
    expect(() => new Entity({ dbPath: './db.json' })).to.not.throw()
  })

  it('create()', () => {
    const newEntity = Entity.create({
      table: 'users',
      entity: {
        username: 'lucas'
      }
    })

    expect(newEntity.uuid).to.not.equal(undefined)
    expect(newEntity.uuid).to.be.a('string')

    const foundEntity = Entity.read({ table: 'users', uuid: newEntity.uuid })

    expect(newEntity.uuid).to.equal(foundEntity.uuid)
    expect(newEntity.username).to.equal(foundEntity.username)
  })

  it('read()', () => {
    const joel = Entity.read({ table: 'users', uuid: 'a1b2c3' })

    expect(joel.username).to.equal('joel')
  })

  it('update()', () => {
    const entity = Entity.read({ table: 'users', uuid: 'a1b2c3' })
    entity.name = 'joel wallis'
    Entity.update({
      table: 'users',
      uuid: entity.uuid,
      entity: entity
    })
    const updatedEntity = Entity.read({ table: 'users', uuid: 'a1b2c3' })
    expect(entity.uuid).to.equal(updatedEntity.uuid)
    expect(entity.username).to.equal(updatedEntity.username)
    expect(entity.name).to.equal(updatedEntity.name)
  })

  it('delete()', () => {
    // - Ler entidade
    // deletar
    // conferir se a entidade foi deletada da tabela
    const entity = Entity.read({ table: 'users', uuid: 'a1b2c3' })
    Entity.delete({
      table: 'users',
      uuid: entity.uuid
    })
    const deletedEntity = Entity.read({ table: 'users', uuid: 'a1b2c3' })
    expect(deletedEntity).to.equal(undefined)
  })
})
