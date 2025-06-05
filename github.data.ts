import {rdfDereferencer} from "rdf-dereference";
import {RdfStore} from 'rdf-stores';
import {DataFactory} from 'rdf-data-factory';

const DF = new DataFactory();

export default {
   async load() {
      console.log('Loading RDF-Connect data from GitHub...');

      const processorRepos = await fetchGitHubData('rdfc-processor');
      const processors = await discoverFromRepositories(processorRepos, 'https://w3id.org/rdf-connect/ontology#Processor');
      const runnerRepos = await fetchGitHubData('rdfc-runner');
      const runners = await discoverFromRepositories(runnerRepos, 'https://w3id.org/rdf-connect/ontology#Runner');
      const orchestratorRepos = await fetchGitHubData('rdfc-orchestrator');
      const orchestrators = await discoverFromRepositories(orchestratorRepos, 'https://w3id.org/rdf-connect/ontology#Orchestrator');
      const pipelineRepos = await fetchGitHubData('rdfc-pipeline');
      const pipelines = mapFromRepositories(pipelineRepos);
      const allRepos = await fetchGitHubData('rdf-connect');
      const otherRepos = allRepos.filter((repo: any) => {
         return !processors.some((p: any) => p.repository_url === repo.url) &&
            !runners.some((r: any) => r.repository_url === repo.url) &&
            !orchestrators.some((o: any) => o.repository_url === repo.url) &&
            !pipelines.some((p: any) => p.repository_url === repo.url);
      });
      const other = mapFromRepositories(otherRepos);

      return {
         other: other,
         processors: processors,
         runners: runners,
         orchestrators: orchestrators,
         pipelines: pipelines,
      };
   },
}

async function fetchGitHubData(topic: string) {
   const url = `https://api.github.com/search/repositories?q=fork:true+topic:${topic}`
   const response = await fetch(url, {
      headers: {
         'Accept': 'application/vnd.github+json',
         'X-GitHub-Api-Version': '2022-11-28',
      }
   });
   const data = await response.json();
   const results = await Promise.all(data.items.map(async (item: any) => {
      // Only include a fork if the upstream repository is not included in the results.
      if (item.fork) {
         // Fetch the repository metadata for the parent repository.
         const repoResponse = await fetch(item.url, {
            headers: {
               'Accept': 'application/vnd.github+json',
               'X-GitHub-Api-Version': '2022-11-28',
            }
         });
         const repo = await repoResponse.json();
         // Check if the upstream repository is already in the results.
         if (data.items.some((upstream: any) => upstream.full_name === repo.parent.full_name)) {
            return null;
         }
      }
      return item;
   }));

   return results.filter((item: any) => item !== null).map((item: any) => {
      return {
         name: item.full_name,
         url: item.html_url,
         description: item.description,
         branch: item.default_branch,
      }
   });
}

async function getAllTurtleContentFromRepository(repository: any) {
   const store = RdfStore.createDefault();
   const url = `https://api.github.com/repos/${repository.name}/git/trees/${repository.branch}?recursive=1`;
   const response = await fetch(url, {
      headers: {
         'Accept': 'application/vnd.github+json',
         'X-GitHub-Api-Version': '2022-11-28',
      }
   });
   const data = await response.json();

   // Find all turtle files as they can contain processor definitions.
   const turtleFiles = data.tree?.filter((file: any) => file.path.endsWith('.ttl')) || [];
   for (const file of turtleFiles) {
      try {
         // Skip file if the path contains 'test' as these are not relevant.
         if (file.path.includes('test')) {
            continue;
         }
         const fileStore = RdfStore.createDefault();
         const fileUrl = `https://raw.githubusercontent.com/${repository.name}/${repository.branch}/${file.path}`;
         const dereferenced = await rdfDereferencer.dereference(fileUrl);
         await new Promise((resolve, reject) => {
            fileStore.import(dereferenced.data).on('end', () => {
               resolve(null);
            }).on('error', (error: any) => {
               console.error(`Error importing data from ${fileUrl}:`, error);
               reject(error);
            });
         });
         // Check if the file is not a pipeline file.
         if ((await fileStore.match(null, DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), DF.namedNode('https://w3id.org/rdf-connect/ontology#Pipeline')).toArray({limit: 1})).length === 0) {
            await new Promise((resolve, reject) => {
               store.import(fileStore.match()).on('end', () => {
                  resolve(null);
               }).on('error', (error: any) => {
                  console.error(`Error importing data from ${fileUrl}:`, error);
                  reject(error);
               });
            });
         }
      } catch (error) {
         // Some files might not be valid Turtle files or might not exist, go on.
      }
   }
   return store;
}

async function discoverFromRepositories(repositories: any[], type: string) {
   const discoverings = [];
   for (const repo of repositories) {
      let discovered = false;
      const store = await getAllTurtleContentFromRepository(repo);

      // Now query the store for the definitions.
      const terms = await store.match(null, DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), DF.namedNode(type)).map(q => q.subject).toArray();
      for (const term of terms) {
         const label = (await store.match(term, DF.namedNode('http://www.w3.org/2000/01/rdf-schema#label')).toArray())[0]?.object.value || (await store.match(term, DF.namedNode('http://purl.org/dc/terms/title')).toArray())[0]?.object.value || term.value.split(/[/#]/).pop() || '';
         const description = (await store.match(term, DF.namedNode('http://www.w3.org/2000/01/rdf-schema#content')).toArray())[0]?.object.value || (await store.match(term, DF.namedNode('http://purl.org/dc/terms/description')).toArray())[0]?.object.value || '';
         discoverings.push({
            name: label,
            description: description,
            iri: term.value,
            repository_name: repo.name,
            repository_url: repo.url,
         });
         discovered = true;
      }
      if (!discovered) {
         // If none were discovered, we still want to add the repository with its metadata.
         discoverings.push({
            name: repo.name,
            description: repo.description,
            repository_name: repo.name,
            repository_url: repo.url,
         });
      }
   }
   return discoverings;
}

function mapFromRepositories(repositories: any[]) {
   return repositories.map((repo: any) => {
      return {
         name: repo.name,
         description: repo.description,
         repository_name: repo.name,
         repository_url: repo.url,
      }
   })
}
