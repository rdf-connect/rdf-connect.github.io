<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {createHighlighter, type Highlighter} from 'shiki'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    default: 'ts'
  },
  theme: {
    type: String,
    default: 'github-dark'
  }
})

const highlighted = ref('')
const copied = ref(false)
let highlighter: Highlighter | null = null

async function highlight() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: [props.theme],
      langs: [props.lang]
    })
  }

  highlighted.value = highlighter.codeToHtml(props.code, {
    lang: props.lang,
    theme: props.theme
  })
}


async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 1500)
}

onMounted(highlight)
watch(() => props.code, highlight)
</script>

<template>
  <div class="shiki-wrapper">
    <button class="copy-button" @click="copyCode">
      {{ copied ? 'Copied' : 'Copy' }}
    </button>

    <div
        class="shiki-container"
        v-html="highlighted"
    />
  </div>
</template>

<style scoped>

.shiki-wrapper {
  position: relative;
}

/* Scroll container */
.shiki-container :deep(pre) {
  overflow-x: auto;
  padding: 16px;
  border-radius: 8px;
}

/* Copy button */

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;

  font-size: 12px;
  padding: 4px 8px;

  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);

  background: var(--vp-c-bg-soft);
  cursor: pointer;

  opacity: 0;
  transition: opacity 0.2s;
}

.shiki-wrapper:hover .copy-button {
  opacity: 1;
}

.copy-button:hover {
  background: var(--vp-c-bg-mute);
}

</style>
