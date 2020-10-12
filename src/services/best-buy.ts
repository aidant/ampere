import { browser } from '../browser.js'
import { configuration } from '../configuration.js'
import { GraphicsCard, Status, Subscription } from '../types.js'
import { namespace } from '../utilities/log.js'
import { setRandomInterval } from '../utilities/random-interval.js'

const log = namespace('best-buy')

export const getNameFromGraphicsCard = (gpu: GraphicsCard) => {
  if (gpu === GraphicsCard.RTX3080) return 'RTX 3080'
  if (gpu === GraphicsCard.RTX3090) return 'RTX 3090'
}

export const getUrlFromGraphicsCard = (gpu: GraphicsCard) => {
  if (gpu === GraphicsCard.RTX3080)
    return 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440&intl=nosplash'
  if (gpu === GraphicsCard.RTX3090)
    return 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3090-24gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429434.p?skuId=6429434&intl=nosplash'
}

export const getStockStatus = async (gpu: GraphicsCard) => {
  const url = getUrlFromGraphicsCard(gpu) as string
  const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36' })
  await page.goto(url)
  await page.waitForSelector('.fulfillment-add-to-cart-button .add-to-cart-button')
  const isAvailable = await page.evaluate(() =>
    // @ts-expect-error
    document.querySelector('.fulfillment-add-to-cart-button .add-to-cart-button').textContent !== 'Sold Out'
  )
  await page.close()
  log('isAvailable', isAvailable)
  return isAvailable
}

const status: Status = {
  [GraphicsCard.RTX3080]: {
    isAvailable: false
  },
  [GraphicsCard.RTX3090]: {
    isAvailable: false
  }
}

export const subscribeToStockStatus = (subscription: Subscription) => {
  setRandomInterval(async () => {
    for (const product of [GraphicsCard.RTX3080, GraphicsCard.RTX3090]) {
      try {
        const isAvailable = await getStockStatus(product)
        if (status[product].isAvailable !== isAvailable) {
          status[product].isAvailable = isAvailable
          subscription(product, { isAvailable })
        }
      } catch (error) {
        log(error)
      }
    }
  }, configuration.application.interval)
}
