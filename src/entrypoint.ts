console.log(String.raw`
   (
   )\      )           (  (     (
((((_)(   (    '  )   ))\ )(   ))\
 )\ _ )\  )\  '/(/(  /((_|()\ /((_)
 (_)_\(_)((_))((_)_\(_))  ((_|_))
  / _ \| '  \() '_ \) -_)| '_/ -_)
 /_/ \_\_|_|_|| .__/\___||_| \___|
              |_|
`)
import Discord, { Message, TextChannel } from 'discord.js'
import 'dotenv/config.js'
import { configuration } from './configuration.js'
import { notificationChannel } from './models/notification-channel.js'
import { subscriptions } from './models/subscriptions.js'
import * as bestbuy from './services/best-buy.js'
import * as nvidia from './services/nvidia.js'
import { log } from './utilities/log.js'

const client = new Discord.Client()
await client.login(configuration.discord.token)
log(await client.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS']))

interface Command {
  command (context: Message, ...segments: string[]): Promise<string | void>
}

const commands: Record<string, Command> = {
  subscription: await import('./commands/subscription.js'),
  'notification-channel': await import('./commands/notification-channel.js')
}

client.on('message', async (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(('ampere '))) return
  const [command, ...segments] = message.content.substring(7).split(/\s+/)

  if (command in commands) {
    const response = await commands[command].command(message, ...segments)
    if (response) await message.channel.send(response)
  } else {
    await message.channel.send(`Unknown command: "${command}".`)
  }
})

nvidia.subscribeToStockStatus(async (gpu, { isAvailable }) => {
  if (!isAvailable) return

  const users = (await subscriptions.get(gpu))
    .map((user) => `<@${user}>`)
    .join(' ')

  for (const [guildId, channelId] of notificationChannel) {
    const guild = await client.guilds.fetch(guildId)
    const channel = guild.channels.resolve(channelId) as TextChannel

    await channel.send(`${nvidia.getNameFromGraphicsCard(gpu)} is in stock.\n${nvidia.getUrlFromGraphicsCard(gpu)}\n${users}`)
  }
})

bestbuy.subscribeToStockStatus(async (gpu, { isAvailable }) => {
  if (!isAvailable) return

  const users = (await subscriptions.get(gpu))
    .map((user) => `<@${user}>`)
    .join(' ')

  for (const [guildId, channelId] of notificationChannel) {
    const guild = await client.guilds.fetch(guildId)
    const channel = guild.channels.resolve(channelId) as TextChannel

    await channel.send(`${bestbuy.getNameFromGraphicsCard(gpu)} is in stock.\n${bestbuy.getUrlFromGraphicsCard(gpu)}\n${users}`)
  }
})
