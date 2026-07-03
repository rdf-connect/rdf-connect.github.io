---
aside: false
---
<script setup lang="ts">
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
}
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = {
    env: {},
    nextTick: (fn: (...args: any[]) => void, ...args: any[]) => Promise.resolve().then(() => fn(...args))
  };
}

import { ref, onMounted, watch } from 'vue';
import { data } from '/github.data.ts';
import ShikiCodeBlock from './parts/ShikiCodeBlock.vue';
import { useData } from 'vitepress'; 
import str from "string-to-stream";
import {rdfParser} from "rdf-parse";
import {DataFactory} from "rdf-data-factory"; 
import {RdfStore} from "rdf-stores"; 

const DF = new DataFactory();

const rendererLoaded = ref(false);

onMounted(async () => {
  await import('shacl-ui');
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

const pipelineFocusNode = ref<string>('http://example.org/myPipeline');

watch(input, async (newInput) => {
    const textStream = str(newInput);
    const quadStream = rdfParser.parse(textStream, {contentType: 'text/turtle'});
    const store = RdfStore.createDefault();
    await new Promise((resolve, reject) => {
        store.import(quadStream).on("end", resolve).on("error", reject);
    });
    const pipelineSubject = store.getQuads(null, DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), DF.namedNode('https://w3id.org/rdf-connect#Pipeline'))[0]?.subject;
    if (pipelineSubject) {
        pipelineFocusNode.value = pipelineSubject.value;
    } else {
        pipelineFocusNode.value = '';
    }
});

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
        :focusNode="pipelineFocusNode"
        constraintShape="http://example.org/PipelineShape"
        componentClass="bg-transparent dark:bg-transparent"
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
