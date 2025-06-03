# What is RDF-Connect?

RDF-Connect is an open-source, declarative framework designed to facilitate streaming and cross-environment data
processing pipelines using RDF standards.
The primary goal of RDF-Connect is to enable interoperability across different programming languages and execution
environments, such as JavaScript, Java, and Python, by connecting data processors through standardized communication
channels.

With RDF-Connect, processors can be developed in any programming language that has a supported runner, enabling
developers to use familiar tools and languages.
These processors are designed to be modular, reusable, and traceable, making them easy to manage and debug.
Once created, processors can be seamlessly integrated into cross-language pipelines, offering a high degree of
flexibility.
This modular approach empowers developers to build, maintain, and extend complex data processing workflows with ease.

RDF-Connect leverages RDF and the PROV-O (Provenance Ontology) standard to formally describe both the structure of data
processing pipelines and their execution history.
By representing processors, data flows, and runtime activities as linked data, RDF-Connect ensures that every step of
the pipeline is transparent and traceable.
This built-in provenance tracking enhances reproducibility, making it easier to audit, share, and understand how data
was transformed throughout the pipeline.
