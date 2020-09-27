import { Message } from 'discord.js'
import { subscriptions } from '../models/subscriptions.js'
import { GraphicsCard } from '../services/nvidia.js'

export const command = async (context: Message, action: string, ...segments: string[]) => {
  const message = segments.join(' ')
  const gpus: GraphicsCard[] = []

  if (/(rtx)? ?3080/i.test(message)) gpus.push(GraphicsCard.RTX3080)
  if (/(rtx)? ?3090/i.test(message)) gpus.push(GraphicsCard.RTX3090)

  switch (action) {
    case 'add':
      await subscriptions.subscribe(context.author, ...gpus)
      return 'Subscription added.'
    case 'remove':
      await subscriptions.unsubscribe(context.author, ...gpus)
      return 'Subscription removed.'
    default:
      return `Unknown action: "${action}" valid actions are: add or remove.`
  }
}
