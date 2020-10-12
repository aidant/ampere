export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = !isProduction

export const configuration = {
  application: {
    interval: Number(process.env.APPLICATION_INTERVAL) || 1000 * 60 * 2.5,
    directory: process.env.APPLICATION_DIRECTORY || 'data'
  },
  discord: {
    token: process.env.DISCORD_TOKEN
  }
}
