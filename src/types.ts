export enum GraphicsCard {
  RTX3080 = '5438481700',
  RTX3090 = '5438481600',
}

export type Status = Record<GraphicsCard, { isAvailable: boolean }>

export type Subscription = (gpu: GraphicsCard, status: { isAvailable: boolean }) => void
