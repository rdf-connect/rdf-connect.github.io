---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "RDF-Connect"
  text: ""
  tagline: "Building Streaming and Cross-Environment Data Processing Pipelines with RDF-Connect"
  image:
    light: /logo.svg
    dark: /logo-dark.svg
    alt: "RDF-Connect"
  actions:
    - theme: brand
      text: What is RDF-Connect?
      link: /what-is-rdf-connect
    - theme: alt
      text: Quickstart
      link: /getting-started
    - theme: alt
      text: Specification
      link: https://rdf-connect.github.io/specification/
    - theme: alt
      text: GitHub
      link: https://github.com/rdf-connect

features:
  - title: Stream Processing
    details: Real-time data flows through the pipeline, enabling processors to handle incoming data promptly.
  - title: Cross-Environment
    details: Processors written in different languages can be seamlessly integrated into the same pipeline.
  - title: RDF First
    details: RDF and PROV-O document and trace the pipeline structure and execution, thereby enhancing transparency and reproducibility.
  - title: Modular
    details: Processors and runners can be reused and combined in various ways, allowing for flexible pipeline configurations.
---

<div style="margin-top: 10em;"></div>

# Discover Existing Work

Explore existing RDF-Connect processors, runners, orchestrators, and pipelines, contributed by developers across diverse use cases.
Thanks to GitHub’s topic-based search, you can easily find and reuse what’s already available.
Look for repositories tagged with `rdf-connect` and specific labels like `rdfc-processor`, `rdfc-runner`, `rdfc-orchestrator`, or `rdfc-pipeline`.
If you’re contributing, tagging your work helps others discover and build upon it.
Read more about [discovering existing work](./discover-existing-work).

<!--@include: ./parts/component-discovery.md-->
