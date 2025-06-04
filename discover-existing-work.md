<script setup>
import { ref, computed } from 'vue';
import { data } from './github.data.ts';

const discover = ref('all');
const search = ref('');

const filteredData = computed(() => {
    let filtered = data[discover.value] || [];
    if (discover.value === 'all') {
        filtered = [...data.processors, ...data.runners, ...data.orchestrators, ...data.pipelines, ...data.other];
    }
    if (search.value) {
        const searchLower = search.value.toLowerCase();
        filtered = filtered.filter(item => 
            item.name?.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower) ||
            item.repository_name?.toLowerCase().includes(searchLower)
        );
    }
  return filtered;
});
</script>

# Discover Existing Work

RDF-Connect empowers developers to build modular, reusable, and interoperable data processing pipelines.
Since its inception, many developers have contributed processors, runners, orchestrators, and complete pipelines across
various use cases and environments.
This means you don’t have to start from scratch — much of what you need may already exist.
On this page, you’ll be able to discover such existing components, ready to be reused and adapted to your own needs.
By leveraging the work of those who came before you, you can accelerate development, ensure consistency, and focus on
what makes your pipeline unique.

This discoverability is made possible through GitHub’s topic-based search.
By using standardized topics, it’s easy to find RDF-Connect-related components across the platform.
To support this, we encourage all developers to annotate their repositories with the topic `rdf-connect` for general
inclusion in the ecosystem.
Additionally, please use one or more of the following specific tags to classify your contribution: `rdfc-processor`,
`rdfc-runner`, `rdfc-orchestrator`, or `rdfc-pipeline`.
Consistent tagging not only increases visibility but also strengthens the discoverability and reusability of your work
for others in the community.

<div class="form-group" style="margin-top: 4em;">
    <label for="discover">Discover</label>
    <select v-model="discover" id="discover">
      <option value="all">All</option>
      <option value="processors">Processors</option>
      <option value="runners">Runners</option>
      <option value="orchestrators">Orchestrators</option>
      <option value="pipelines">Pipelines</option>
    </select>
</div>
<div class="form-group" style="gap: 21px;">
    <label for="search">Search</label>
    <input v-model="search" id="search" type="text" placeholder="Search by name, description, or repository name" />
</div>

<div class="card" style="padding: 8px;">
    <div class="row">
        <div v-for="item in filteredData" :key="item.name" class="col-md-6">
            <div class="card">
                <h3>{{ item.name }}</h3>
                <small>{{ item.iri }}</small>
                <p>{{ item.description }}</p>
                <a :href="item.repository_url">
                    <span class="vpi-social-github github">___</span>
                    {{ item.repository_name }}
                </a>
            </div>
        </div>
        <div v-if="filteredData.length === 0">
            <p style="margin-left: 16px;"><i>No results found. Try changing your search criteria or check back later as more components are added.</i></p>
        </div>
    </div>
</div>

<style>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}
.row {
  display: flex;
  flex-wrap: wrap;
}
.col-md-6 {
  flex: 0 0 50%;
  box-sizing: border-box;
  padding: 8px;
}
@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
  }
}
select, input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.form-group {
  margin-top: 1em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.github {
    --icon: url('https://api.iconify.design/simple-icons/github.svg');
}
</style>
