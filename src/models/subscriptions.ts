import { User } from 'discord.js'
import { GraphicsCard } from '../services/nvidia.js'
import { Model } from '../utilities/model.js'

class Subscriptions extends Model {
  protected state: Partial<Record<GraphicsCard, string[]>> = {}

  constructor () {
    super('subscriptions')
  }

  async subscribe (user: User, ...gpus: GraphicsCard[]) {
    for (const gpu of gpus) {
      const subscriptions = this.state[gpu] = this.state[gpu] || []
      const isSubscribed = subscriptions.includes(user.id)
      if (!isSubscribed) subscriptions.push(user.id)
    }
    await this.save()
  }

  async unsubscribe (user: User, ...gpus: GraphicsCard[]) {
    for (const gpu of gpus) {
      const subscriptions = this.state[gpu] = this.state[gpu] || []
      const index = subscriptions.indexOf(user.id)
      if (index >= 0) subscriptions.splice(index, 1)
    }
    await this.save()
  }

  async get (gpu: GraphicsCard) {
    return this.state[gpu] || []
  }
}

export const subscriptions = new Subscriptions()
await Model.initialize(subscriptions)
