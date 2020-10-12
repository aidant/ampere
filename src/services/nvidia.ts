import axios from 'axios'
import { configuration } from '../configuration.js'
import { GraphicsCard, Status, Subscription } from '../types.js'
import { namespace } from '../utilities/log.js'
import { setRandomInterval } from '../utilities/random-interval.js'

const log = namespace('nvidia')

export const getNameFromGraphicsCard = (gpu: GraphicsCard) => {
  if (gpu === GraphicsCard.RTX3080) return 'RTX 3080'
  if (gpu === GraphicsCard.RTX3090) return 'RTX 3090'
}

export const getUrlFromGraphicsCard = (gpu: GraphicsCard) => {
  if (gpu === GraphicsCard.RTX3080) return 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/'
  if (gpu === GraphicsCard.RTX3090) return 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090/'
}

interface Products {
  products: {
    product: {
      id: GraphicsCard
      inventoryStatus: {
        status: 'PRODUCT_INVENTORY_OUT_OF_STOCK' | 'PRODUCT_INVENTORY_IN_STOCK'
      }
    }[]
  }
}

const getStockStatus = async (...gpus: GraphicsCard[]): Promise<Status> => {
  const response = await axios.get<Products>(
    `https://api-prod.nvidia.com/direct-sales-shop/DR/products/en_us/USD/${gpus}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
      },
    }
  )

  const status: Status = {} as Status

  for (const product of response.data.products.product) {
    const isAvailable = product.inventoryStatus.status !== 'PRODUCT_INVENTORY_OUT_OF_STOCK'
    log('isAvailable', isAvailable)
    status[product.id] = { isAvailable }
  }

  return status
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
    try {
      const products = [GraphicsCard.RTX3080, GraphicsCard.RTX3090]
      const current = await getStockStatus(...products)

      for (const product of products) {
        if (status[product].isAvailable !== current[product].isAvailable) {
          subscription(product, status[product] = current[product])
        }
      }
    } catch (error) {
      log(error)
    }
  }, configuration.application.interval)
}
