import { getCloudflareContext } from '@opennextjs/cloudflare'
import { drizzle as drizzleOrm } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

const { env } = await getCloudflareContext({ async: true })
export const drizzle = drizzleOrm(env.DB, { schema })
