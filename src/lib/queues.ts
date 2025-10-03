import { Queue } from 'bullmq'
import Redis from 'ioredis'

// Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Create job queues
export const orderProcessingQueue = new Queue('orderProcessing', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

export const providerSyncQueue = new Queue('providerSync', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 20,
    removeOnFail: 20,
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
})

export const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 20,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})

// Job data types
export interface OrderProcessingJob {
  orderId: string
  userId: string
  serviceId: string
  providerId: string
  link: string
  quantity: number
}

export interface ProviderSyncJob {
  providerId: string
  action: 'sync_services' | 'check_status'
}

export interface EmailJob {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

// Add jobs to queues
export const addOrderProcessingJob = async (data: OrderProcessingJob) => {
  return orderProcessingQueue.add('processOrder', data, {
    priority: 1,
    delay: 1000, // 1 second delay to ensure database consistency
  })
}

export const addProviderSyncJob = async (data: ProviderSyncJob) => {
  return providerSyncQueue.add('syncProvider', data)
}

export const addEmailJob = async (data: EmailJob) => {
  return emailQueue.add('sendEmail', data)
}

export { connection }