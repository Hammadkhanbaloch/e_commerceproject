import dotenv from 'dotenv'
import dns from 'node:dns/promises'
import https from 'node:https'

dotenv.config()

function getPublicIp() {
  return new Promise((resolve) => {
    const req = https.get('https://api.ipify.org?format=json', (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          resolve(parsed?.ip || null)
        } catch {
          resolve(null)
        }
      })
    })
    req.on('error', () => resolve(null))
    req.end()
  })
}

async function main() {
  const mongoUri = process.env.MONGO_URI || ''
  console.log('[diagnose] NODE_ENV:', process.env.NODE_ENV || '(not set)')
  console.log('[diagnose] MONGO_URI set:', Boolean(mongoUri))

  const ip = await getPublicIp()
  if (ip) console.log('[diagnose] Public IP:', ip)

  // Quick DNS checks
  const hostMatch = mongoUri.match(/@([^/?:]+)/)
  const host = hostMatch?.[1]

  if (mongoUri.startsWith('mongodb+srv://')) {
    console.log('[diagnose] Using SRV URI (mongodb+srv://). This requires DNS SRV/TXT to work.')
  } else if (mongoUri.startsWith('mongodb://')) {
    console.log('[diagnose] Using standard URI (mongodb://). This avoids SRV/TXT lookup.')
  }

  if (host) {
    try {
      const addrs = await dns.lookup(host, { all: true })
      console.log(`[diagnose] DNS lookup ok: ${host} -> ${addrs.map((a) => a.address).join(', ')}`)
    } catch (e) {
      console.log(`[diagnose] DNS lookup failed for ${host}:`, e?.message || e)
    }

    try {
      const txt = await dns.resolveTxt(host)
      console.log(`[diagnose] DNS TXT lookup ok: ${host} (records: ${txt.length})`)
    } catch (e) {
      console.log(`[diagnose] DNS TXT lookup failed for ${host}:`, e?.message || e)
      console.log('[diagnose] If you see queryTxt ETIMEOUT/EREFUSED, switch to Atlas "Standard connection string" (mongodb://...).')
    }
  }

  console.log('\n[diagnose] Next steps:')
  console.log('- In Atlas: Security -> Network Access -> Add your current IP (or temporarily 0.0.0.0/0).')
  console.log('- In Atlas: Security -> Database Access -> Rotate the DB user password if it was shared.')
  console.log('- Put the updated password into server/.env locally (do not paste it in chat).')
}

main().catch((err) => {
  console.error('[diagnose] failed', err)
  process.exit(1)
})
