import * as schema from '../db/schema'
import { drizzle } from '../lib/drizzle'

export default async function Page() {
  const seisans = await drizzle.select().from(schema.seisans).all()

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <div>
        <ul>
          {seisans.map((seisan) => (
            <li key={seisan.id}>{seisan.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
