import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import sources from '@/data/sources'

const defaultSourceId =
  Object.keys(sources).find((id) => sources[id].default) || Object.keys(sources)[0]

const resolveSourceRoute = (sourceId) => {
  if (sourceId && sources[sourceId]?.enabled) {
    return sourceId
  }

  return defaultSourceId
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: `/${defaultSourceId}`,
    },
    {
      path: '/:sourceId',
      name: 'source',
      component: Home,
      props: true,
      beforeEnter: (to) => {
        const resolvedSource = resolveSourceRoute(to.params.sourceId)

        if (resolvedSource === to.params.sourceId) {
          return true
        }

        return {
          name: 'source',
          params: { sourceId: resolvedSource },
          replace: true,
        }
      },
    },
  ],
})

export default router
