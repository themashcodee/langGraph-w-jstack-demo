import { j } from "./jstack"
import { chat_router } from "./routers/chat_router"

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
	.router()
	.basePath("/api")
	.use(j.defaults.cors)
	.onError(j.defaults.errorHandler)

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const app_router = j.mergeRouters(api, {
	chat: chat_router,
})

export type AppRouter = typeof app_router

export default app_router
