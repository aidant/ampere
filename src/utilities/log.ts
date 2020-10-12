import debug from 'debug'
if (!process.env.DEBUG) debug.enable('ampere*')
export const log = debug('ampere')
export const namespace = log.extend.bind(log)
