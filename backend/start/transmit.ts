import type { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'

transmit.authorize<{ id: string }>('notification/:id', (ctx: HttpContext, { id }) => {
  const user = ctx.auth?.user
  if (!user) return false
  return user.id === id
})
