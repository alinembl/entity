/**
 * Entity ODM
 */

import fs from 'fs'
import uuid from 'uuid'

export default class Entity {
  static create (params) {
    const { table, entity } = params

    entity.uuid = uuid()

    const fileContents = fs.readFileSync('../db.json', 'utf8')
    const db = JSON.parse(fileContents)

    db[table].push(entity)
    // console.log(db)
    const data = JSON.stringify(db)
    // console.log(data)
    fs.writeFileSync('../db.json', data, 'utf8')

    return entity
  }

  static read (params) {
    const fileContents = fs.readFileSync('../db.json', 'utf8')
    const db = JSON.parse(fileContents)

    const entity = db[params.table].find(entity => {
      return params.uuid === entity.uuid
    })
    return entity
  }

  static update (params) {
    const { table, entity } = params

    const fileContents = fs.readFileSync('../db.json', 'utf8')
    const db = JSON.parse(fileContents)

    const entityToDelete = db[table].find(entity => {
      return params.uuid === entity.uuid
    })
    const indexToDelete = db[table].indexOf(entityToDelete)
    db[table].splice(indexToDelete, 1)
    db[table].push(entity)

    const data = JSON.stringify(db)
    fs.writeFileSync('../db.json', data, 'utf8')

    return entity
  }

  static delete (params) {
    const { table, uuid } = params

    const fileContents = fs.readFileSync('../db.json', 'utf8')
    const db = JSON.parse(fileContents)

    const entityToDelete = db[table].find(entity => {
      return uuid === entity.uuid
    })

    const indexToDelete = db[table].indexOf(entityToDelete)
    db[table].splice(indexToDelete, 1)

    const data = JSON.stringify(db)
    fs.writeFileSync('../db.json', data, 'utf8')
  }
}
