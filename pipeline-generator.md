---
aside: false
---
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { data } from '/github.data.ts';
import ShikiCodeBlock from './parts/ShikiCodeBlock.vue';
import { useData } from 'vitepress';

const rendererLoaded = ref(false);

onMounted(async () => {
  await import('shacl-ui.js');
  rendererLoaded.value = true;
});

const rendererEl = ref(null);

const input = ref<string>(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix ex: <http://example.org/>.

ex:myPipeline a rdfc:Pipeline ;
    rdfc:consistsOf [
        rdfc:instantiates rdfc:NodeRunner
    ] .
`);
const draftInput = ref<string>(input.value);

function commitInput() {
    input.value = draftInput.value;
}

const { isDark } = useData();

const theme = ref(isDark.value ? 'dark' : 'light');

watch(isDark, (dark) => {
  theme.value = dark ? 'dark' : 'light';
}, { immediate: true });

console.log('shapesGraph:', data.shapesGraph);

const extractedPipeline = ref<string>('');

async function extractPipeline() {
    if (rendererEl.value) {
        const pipelineTtl = await rendererEl.value.data('text/turtle');
        console.log('Extracted pipeline.ttl:', pipelineTtl);
        extractedPipeline.value = pipelineTtl;
    }
}
</script>

# Pipeline Generator

<label for="input" style="display: block; font-weight: bold; margin-bottom: 0.5em;">Input pipeline.ttl</label>
<textarea name="input" v-model="draftInput" @blur="commitInput" @keydown.ctrl.enter="commitInput" rows="9" style="width: 100%; margin-bottom: 1em; padding: 0.5em; border: 1px solid #ccc; border-radius: 4px; font-family: monospace;" />

<div style="padding-top: 2em; padding-bottom: 2em;">

  <form id="pipeline-form" action="#" @submit.prevent="extractPipeline">
    <ClientOnly>
      <shacl-renderer
        ref="rendererEl"
        v-if="rendererLoaded"
        id="shacl-renderer"
        :theme="theme"
        :dataGraph="input"
        dataGraphContentType="text/turtle"
        :shapesGraph="data.shapesGraph"
        shapesGraphContentType="text/turtle"
        widgetScoringGraphUrl="/assets/widget-scoring.ttl"
        focusNode="http://example.org/myPipeline"
        constraintShape="http://example.org/PipelineShape"
        componentClass=""
      >
      </shacl-renderer>
    </ClientOnly>
    <button type="submit" style="margin-top: 1em; background-color: #00aad4; color: white; border: none; padding: 0.5em 1em; border-radius: 4px; cursor: pointer;">Extract pipeline.ttl</button>
  </form>

  <template v-if="extractedPipeline">

  </template>
</div>

<ShikiCodeBlock
  v-if="extractedPipeline"
  :code="extractedPipeline"
  lang="turtle"
/>
