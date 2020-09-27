export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = !isProduction

export const configuration = {
  application: {
    directory: process.env.APPLICATION_DIRECTORY || 'data'
  },
  discord: {
    token: process.env.DISCORD_TOKEN
  }
}
