import { Snowflake } from 'discord.js'
import { MapModel, Model } from '../utilities/model.js'

class NotificationChannel extends MapModel<Record<Snowflake, Snowflake>> {
  protected state = {}

  constructor () {
    super('notification-channel')
  }
}

export const notificationChannel = new NotificationChannel()
await Model.initialize(notificationChannel)
