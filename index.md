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

