<script setup lang="ts">
import { ref, nextTick } from 'vue'

// Simple message type
type Msg = { id: number; role: 'user' | 'bot' | 'system'; text: string; time: string }

const input = ref('')
const messages = ref<Msg[]>([
  {
    id: 1,
    role: 'bot',
    text: '👋 Hoi! Ich bin Flavortron, dein persönlicher Küchen-Bot. Bereit, deine Gerichte auf das nächste Level zu bringen! 🍳✨',
    time: new Date().toLocaleTimeString()
  }
])
let idCounter = 2

const listEl = ref<HTMLElement | null>(null)

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function botReply(userText: string): string | null {
  const t = normalize(userText)

  // Begrüßung
  if (["hallo", "hi", "hoi", "salü", "salut"].includes(t))
    return '👋 Hoi! Ich bin Flavortron, bereit deine Gerichte auf das nächste Level zu bringen! 🍳✨'

  // Abschied
  if (/(\bbye\b|\bbey\b|tsch(ü|u)ss|tschu(?!r)|ciao|tschau)/.test(t))
    return 'Tschau! Viel Spaß beim Kochen! 🍲'

  // Simulierte Koch-Antworten
  if (t.includes("gemüse") && t.includes("verwenden"))
    return 'Klar! Du kannst das Gemüse auch nehmen. Es passt super zu diesem Rezept 🥦🍅'

  if (t.includes("ersatz") && t.includes("zucker"))
    return 'Kein Problem! Honig oder Ahornsirup funktionieren als Ersatz ganz gut 🍯'

  if (t.includes("würzen") || t.includes("gewürze"))
    return 'Ich würde ein bisschen Paprika und Knoblauch hinzufügen – gibt richtig Geschmack! 🌶️🧄'

  if (t.includes("backen") && t.includes("ofen"))
    return 'Heize den Ofen auf 180°C vor, das ist perfekt für die meisten Rezepte! 🔥'

  // Standard: keine Antwort
  return null
}


async function handleSend() {
  const text = input.value.trim()
  if (!text) return

  // push user message
  messages.value.push({ id: idCounter++, role: 'user', text, time: new Date().toLocaleTimeString() })
  input.value = ''
  await nextTick()
  scrollToBottom()

  // decide bot answer
  const reply = botReply(text)
  if (reply) {
    messages.value.push({ id: idCounter++, role: 'bot', text: reply, time: new Date().toLocaleTimeString() })
  } else {
    // show neutral system notice "senden"
    messages.value.push({ id: idCounter++, role: 'system', text: 'senden', time: new Date().toLocaleTimeString() })
  }
  await nextTick()
  scrollToBottom()
}

function scrollToBottom() {
  if (!listEl.value) return
  listEl.value.scrollTop = listEl.value.scrollHeight
}
</script>

<template>
  <v-card elevation="6" class="rounded-xl pa-4 mb-6 mx-auto chat-wrapper" max-width="900">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="text-h6 font-weight-medium">Flavortron</div>
    </div>
    <v-divider class="mb-3" />

    <!-- Messages -->
    <div ref="listEl" class="messages">
      <template v-for="m in messages" :key="m.id">
        <div v-if="m.role === 'system'" class="message message-system">
          <span class="system-chip">{{ m.text }}</span>
        </div>
        <div v-else :class="['message', m.role === 'user' ? 'right' : 'left']">
          <div :class="['bubble', m.role]">
            <div class="text-body-2">{{ m.text }}</div>
            <div class="time text-caption">{{ m.time }}</div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input -->
    <div class="composer mt-3 d-flex align-center gap-2">
      <v-text-field
          v-model="input"
          placeholder="Nachricht eingeben…"
          variant="outlined"
          density="comfortable"
          hide-details
          class="flex-grow-1"
          @keydown.enter.exact.prevent="handleSend"
      />
      <v-btn color="primary" :disabled="!input.trim()" @click="handleSend" size="large" class="rounded-xl px-5">
        Senden
      </v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.chat-wrapper {
  /* outer breathing room if parent is full width */
  margin-left: auto;
  margin-right: auto;
}
.messages {
  color: black;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 50vh; /* nice viewport-size chat area */
  overflow-y: auto;
  padding: 4px 2px;
}
.message {
  display: flex;
}
.message.left { justify-content: flex-start; }
.message.right { justify-content: flex-end; }

.bubble {
  max-width: 75%;
  padding: 10px 12px;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
.bubble.user {
  background: var(--v-theme-primary);
  color: black;
}
.bubble.bot {
  background: rgba(0,0,0,0.04);
}
.time {
  opacity: 0.6;
  margin-top: 4px;
  text-align: right;
}

.message-system {
  display: flex;
  justify-content: center;
}
.system-chip {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(0,0,0,0.06);
}

.composer { gap: 8px; }
</style>
