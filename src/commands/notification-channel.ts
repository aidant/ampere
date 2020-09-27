import { Message } from 'discord.js'
import { notificationChannel } from '../models/notification-channel.js'

export const command = async (context: Message) => {
  if (context.author.id !== (await context.client.fetchApplication()).owner?.id) return

  await notificationChannel.set(context.guild?.id as string, context.channel.id)

  return 'Set the notification channel to be this channel.'
}
