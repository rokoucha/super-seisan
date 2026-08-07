import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import { type NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
}

export default nextConfig

initOpenNextCloudflareForDev()
