import { OpenAPIHono } from '@hono/zod-openapi'
import { handle } from 'hono/vercel'
import packageJson from '../../../../package.json' assert { type: 'json' }

const app = new OpenAPIHono().basePath('/api')

app.get('/', (c) => {
  return c.json({
    version: packageJson.version,
  })
})

export const GET = handle(app)
export const POST = handle(app)
