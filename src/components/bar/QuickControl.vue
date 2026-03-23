<template>
  <div class="quick-control">
    <input
      id="snapcast-volume"
      v-model.number="volume"
      class="quick-control-slider"
      type="range"
      min="0"
      max="100"
      step="1"
      :disabled="clientIds.length === 0 || loading"
      @input="onSliderInput"
      @change="applyVolume"
    />
    <span class="quick-control-value">{{ volume }}%</span>
    <span v-if="errorMessage" class="quick-control-error">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import sources from '@/data/sources'

const loading = ref(false)
const volume = ref(0)
const clientIds = ref([])
const muted = ref(false)
const errorMessage = ref('')
const socket = ref(null)

let requestId = 0
let reconnectTimer = null
let shouldReconnect = true

const pendingRequests = new Map()

const snapcastWebsocketEndpoint = (() => {
  const snapcastSource = sources.snapcast.source

  const sourceUrl = new URL(snapcastSource)
  sourceUrl.protocol = sourceUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  sourceUrl.pathname = '/jsonrpc'
  sourceUrl.search = ''
  sourceUrl.hash = ''

  return sourceUrl.toString()
})()

const listSystemClients = (server) => {
  const groups = server?.groups || []
  const clients = groups.flatMap((group) => group?.clients || []).filter((client) => client?.id)

  if (clients.length === 0) return []

  const connectedClients = clients.filter((client) => client.connected)

  return connectedClients.length > 0 ? connectedClients : clients
}

const setSystemVolumeFromClients = (clients) => {
  if (!Array.isArray(clients) || clients.length === 0) {
    clientIds.value = []
    return
  }

  clientIds.value = clients.map((client) => client.id)

  const percents = clients.map((client) => {
    return Math.max(0, Math.min(100, Number(client?.config?.volume?.percent ?? 0)))
  })

  const averageVolume = Math.round(percents.reduce((sum, next) => sum + next, 0) / percents.length)
  volume.value = averageVolume

  muted.value = clients.every((client) => Boolean(client?.config?.volume?.muted))
}

const resolveServerStatus = (result) => {
  const server = result?.server
  const clients = listSystemClients(server)
  setSystemVolumeFromClients(clients)
}

const loadVolume = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await callSnapcast('Server.GetStatus')
    resolveServerStatus(result)
  } catch {
    clientIds.value = []
    errorMessage.value = 'Snapcast unavailable'
  } finally {
    loading.value = false
  }
}

const processNotification = (message) => {
  if (!message?.method) {
    return
  }

  if (message.method === 'Client.OnVolumeChanged') {
    if (!clientIds.value.includes(message.params?.id)) {
      return
    }

    loadVolume()
    return
  }

  if (message.method === 'Server.OnUpdate') {
    const server = message.params?.server

    if (!server) {
      return
    }

    const clients = listSystemClients(server)
    setSystemVolumeFromClients(clients)
  }
}

const handleSocketMessage = (rawMessage) => {
  let payload

  try {
    payload = JSON.parse(rawMessage.data)
  } catch {
    return
  }

  const messages = Array.isArray(payload) ? payload : [payload]

  for (const message of messages) {
    if (Object.prototype.hasOwnProperty.call(message, 'id')) {
      const handler = pendingRequests.get(message.id)
      if (!handler) {
        continue
      }

      pendingRequests.delete(message.id)

      if (message.error) {
        handler.reject(new Error(message.error?.message || 'Snapcast returned an error'))
      } else {
        handler.resolve(message.result)
      }
      continue
    }

    processNotification(message)
  }
}

const callSnapcast = (method, params = {}) => {
  const activeSocket = socket.value

  if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error('Snapcast socket is not connected'))
  }

  requestId += 1
  const id = requestId

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject })

    activeSocket.send(
      JSON.stringify({
        id,
        jsonrpc: '2.0',
        method,
        params,
      }),
    )

    window.setTimeout(() => {
      if (!pendingRequests.has(id)) {
        return
      }

      pendingRequests.delete(id)
      reject(new Error('Snapcast request timed out'))
    }, 5000)
  })
}

const rejectPendingRequests = () => {
  for (const [, handler] of pendingRequests) {
    handler.reject(new Error('Snapcast socket disconnected'))
  }

  pendingRequests.clear()
}

const connectSocket = () => {
  loading.value = true
  errorMessage.value = ''

  const activeSocket = new WebSocket(snapcastWebsocketEndpoint)
  socket.value = activeSocket

  activeSocket.addEventListener('open', () => {
    loadVolume()
  })

  activeSocket.addEventListener('message', handleSocketMessage)

  activeSocket.addEventListener('error', () => {
    errorMessage.value = 'Snapcast unavailable'
  })

  activeSocket.addEventListener('close', () => {
    rejectPendingRequests()

    if (!shouldReconnect) {
      loading.value = false
      return
    }

    reconnectTimer = window.setTimeout(() => {
      connectSocket()
    }, 2000)
  })
}

const onSliderInput = () => {
  errorMessage.value = ''
}

const applyVolume = async () => {
  if (clientIds.value.length === 0) {
    return
  }

  const targetVolume = Math.max(0, Math.min(100, Number(volume.value)))

  try {
    await Promise.all(
      clientIds.value.map((id) =>
        callSnapcast('Client.SetVolume', {
          id,
          volume: {
            muted: muted.value,
            percent: targetVolume,
          },
        }),
      ),
    )
  } catch {
    errorMessage.value = 'Failed to set volume'
  }
}

onMounted(() => {
  connectSocket()
})

onBeforeUnmount(() => {
  shouldReconnect = false

  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  rejectPendingRequests()

  if (socket.value && socket.value.readyState < WebSocket.CLOSING) {
    socket.value.close()
  }
})
</script>

<style scoped>
.quick-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-control-label {
  font-size: 12px;
  opacity: 0.9;
}

.quick-control-slider {
  width: 140px;
}

.quick-control-value {
  width: 38px;
  text-align: right;
  font-size: 12px;
}

.quick-control-error {
  font-size: 12px;
  color: #ffd7d7;
}
</style>
