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

<style>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
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
