import { promises as fs } from 'fs'
import path from 'path'
import { deserialize, serialize } from 'v8'
import { configuration } from '../configuration.js'

export abstract class Model {
  static async initialize  (model: Model) {
    try {
      await fs.writeFile(model.filepath, serialize(model.state), { flag: 'wx' })
    } catch {
      /*
        Failed to initialize the model on disk with the current state. This
        either means the file already exists, in which case we don't want to
        overwrite it; or we are not allowed to access this filepath, in which
        case we can't do anything about this.
      */
    }
    model.state = deserialize(await fs.readFile(model.filepath))
  }

  protected filepath: string
  protected abstract state: unknown

  constructor (name: string) {
    this.filepath = path.join(process.cwd(), configuration.application.directory, 'models', name)
  }

  protected async save() {
    await fs.writeFile(this.filepath, serialize(this.state))
  }
}

export abstract class MapModel<T extends object> extends Model {
  protected abstract state: T

  async get <P extends keyof T> (property: P): Promise<T[P]>  {
    return this.state[property]
  }

  async set <P extends keyof T> (property: P, value: T[P]): Promise<T[P]>  {
    this.state[property] = value
    await this.save()
    return value
  }

  async has <P extends keyof T> (property: P): Promise<boolean>  {
    return property in this.state
  }

  async delete <P extends keyof T> (property: P): Promise<boolean>  {
    const isDeleted = delete this.state[property]
    await this.save()
    return isDeleted
  }

  * [Symbol.iterator] () {
    for (const property in this.state) {
      yield [property, this.state[property]]
    }
  }
}
