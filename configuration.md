# Configuration

::: warning
This page is still under construction and will be updated soon.
:::

A pipeline typically consists of a Turtle file, although any common RDF serialization is supported, which defines the pipeline configuration.
A pipeline is composed of multiple components, including runners, processors, readers, and writers.
To be able to use these components, they need to be imported into the pipeline configuration using `owl:imports` statements.
The object of the `owl:imports` statement is a URL that points to the Turtle file containing the semantic component definitions in your locally installed package using your package manager (e.g., in your `node_modules` folder for Node.js).


## Configuring a Pipeline

A pipeline is usually configured in a Turtle file called `pipeline.ttl` or similar.
The pipeline is defined as an instance of the `rdfc:Pipeline` class.
However, when a pipeline instance is defined, it won't do much yet.
To make the pipeline functional, it needs to be configured with runners and processors.

The most simple pipeline (which does nothing) looks like this:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors


### Define the channels


### Define the pipeline
<> a rdfc:Pipeline.


### Define the processors

```

A pipeline configuration consists of one or more runner-processors pairs, each including a reference to a runner and to one or more processor instantiations.
Such a pair is typically contained within a blank node, which is then linked to the `rdfc:Pipeline` instance using the `rdfc:consistsOf` property.
The runner is referenced in the blank node using the `rdfc:instantiates` property, which points to the runner's class IRI.
The processors are referenced in the blank node using the `rdfc:processor` property, which points to the processor instantiation's IRI and are typically defined in the same Turtle file.
One triple with the `rdfc:processor` property is needed for each processor you want to attach to the runner.

Below, an explanation is given of how to configure runners and processors in a pipeline configuration.

## Configuring a Runner

A runner is attached to a pipeline using a blank node, which is linked to the `rdfc:Pipeline` instance using the `rdfc:consistsOf` property.
The blank node represents a runner-processors pair and contains the `rdfc:instantiates` property, which points to the runner's class IRI.
Only one `rdfc:consistsOf` triple is needed for each runner you want to attach to the pipeline, and each processor you want to attach to the runner needs its own `rdfc:processor` triple in the same blank node.

Before the runner can be used, we need to make sure the orchestrator knows about it.
Therefore, the runner needs to be installed, and its semantic definition needs to be imported into the pipeline configuration using an `owl:imports` statement.

How you do this depends on the execution environment you are using.

### Example: Configuring a `rdfc:NodeRunner` for JavaScript/TypeScript Processors

The RDF-Connect ecosystem already offers a [js-runner package](https://github.com/rdf-connect/js-runner) published on [npm](https://www.npmjs.com/package/@rdfc/js-runner), which provides a `rdfc:NodeRunner` class for executing JavaScript/TypeScript processors using Node.js, as well as a `rdfc:BunRunner` class for executing JavaScript/TypeScript processors using Bun.
To use the `rdfc:NodeRunner` in your pipeline configuration, you first need to install the `@rdfc/js-runner` package using npm:

```bash
npm install @rdfc/js-runner
```

Next, you need to import the runner's semantic definition into your pipeline configuration using an `owl:imports` statement:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./node_modules/@rdfc/js-runner/index.ttl>.
```

Now you can attach the `rdfc:NodeRunner` to your pipeline configuration using a blank node:

```turtle
### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:NodeRunner;
   ].
```

Next, you can add one or more processors to the runner-processors pair using the `rdfc:processor` property.
You can directly jump to the next section to learn how to configure a processor, or you can hang on to learn more about configuring a runner in different environments.


### Example: Configuring a `rdfc:PyRunner` for Python Processors

The RDF-Connect ecosystem already offers a [py-runner package](https://github.com/rdf-connect/py-runner) published on [PyPI](https://pypi.org/project/rdfc_runner/), which provides a `rdfc:PyRunner` class for executing Python processors using Python.

To manage your project environment in the case of Python, we highly recommend using a `pyproject.toml` file and a virtual environment.
This ensures that you can pin the Python version and the package versions you are using in your project.
Especially a specific Python version is important here, as the path to the installed package contains the Python version and a deterministic path is thus needed in the `owl:imports` statement.

You can start from the following `pyproject.toml` file:

```toml
[project]
name = "your-rdf-connect-pipeline"
version = "0.0.1"
description = "RDF-Connect pipeline for your use case."
requires-python = "==3.13.*"
dependencies = [
    "rdfc-runner>=0.0.3",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["resources"]

[tool.hatch.envs.default]
type = "virtual"
path = ".venv"
system-packages = false
installer = "uv"
env-vars = { PYTHONPATH = "src" }
```

To use the `rdfc:PyRunner` in your pipeline configuration, you first need to install the `rdfc_runner` package using pip or uv:

```bash
uv add rdfc_runner
```

Next, you need to import the runner's semantic definition into your pipeline configuration using an `owl:imports` statement:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./.venv/lib/python3.13/site-packages/rdfc_runner/index.ttl>.
```

Now you can attach the `rdfc:PyRunner` to your pipeline configuration using a blank node:

```turtle
### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:PyRunner;
   ].
```

Next, you can add one or more processors to the runner-processors pair using the `rdfc:processor` property.
You can directly jump to the next section to learn how to configure a processor, or you can hang on to learn more about configuring a runner in different environments.


### Example: Configuring a `rdfc:JvmRunner` for Java/Kotlin Processors

The RDF-Connect ecosystem already offers a [jvm-runner package](https://github.com/rdf-connect/jvm-runner) published through [JitPack](https://javadoc.jitpack.io/com/github/rdf-connect/jvm-runner/runner/master-SNAPSHOT/runner-master-SNAPSHOT-index.jar), which provides a `rdfc:JvmRunner` class for executing Java/Kotlin processors using the Java Virtual Machine (JVM).
To use the `rdfc:JvmRunner` in your pipeline configuration, you need to import the runner's semantic definition from JitPack into your pipeline configuration using an `owl:imports` statement:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <https://javadoc.jitpack.io/com/github/rdf-connect/jvm-runner/runner/master-SNAPSHOT/runner-master-SNAPSHOT-index.jar>.
```

Now you can attach the `rdfc:JvmRunner` to your pipeline configuration using a blank node:

```turtle
### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:JvmRunner;
   ].
```

Next, you can add one or more processors to the runner-processors pair using the `rdfc:processor` property.
You can directly jump to the next section to learn how to configure a processor, or you can hang on to learn more about configuring multiple runners in the same pipeline configuration.


### Example: Configuring Multiple Runners in the Same Pipeline Configuration

You can configure multiple runner-processors pairs in the same pipeline configuration by adding multiple blank nodes to the `rdfc:consistsOf` property of the `rdfc:Pipeline` instance.
This allows you to create cross-environment pipelines that can execute processors written in different programming languages.

An example of a pipeline configuration with both a `rdfc:NodeRunner`, a `rdfc:PyRunner`, and a `rdfc:JvmRunner` is shown below:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./node_modules/@rdfc/js-runner/index.ttl>.
<> owl:imports <./.venv/lib/python3.13/site-packages/rdfc_runner/index.ttl>.
<> owl:imports <https://javadoc.jitpack.io/com/github/rdf-connect/jvm-runner/runner/master-SNAPSHOT/runner-master-SNAPSHOT-index.jar>.

### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:NodeRunner;
   ], [
       rdfc:instantiates rdfc:PyRunner;
   ], [
       rdfc:instantiates rdfc:JvmRunner;
   ].
```

Next, you can add one or more processors to each runner-processors pair using the `rdfc:processor` property.
You will learn how to do this in the next section.


## Configuring a Processor

A processor will perform a specific data processing task in the pipeline and is thus a crucial component.
However, the processor needs to be executed.
This is the responsibility of the runner, which is why a processor always needs to be attached to a specific runner in a pipeline configuration.
To attach a processor to a runner, you need to add an `rdfc:processor` triple to the blank node that represents the runner-processors pair.
The object of the `rdfc:processor` triple is the IRI of the processor instantiation, which is typically defined in the same Turtle file.

Before the processor can be used, we need to make sure the orchestrator knows about it.
Therefore, the processor needs to be installed, and its semantic definition needs to be imported into the pipeline configuration using an `owl:imports` statement.

How you do this, again, depends on the programming language the processor is implemented in.
We will show you how to configure a processor in JavaScript/TypeScript, Python, and Java/Kotlin.

### Example: Configuring a JavaScript/TypeScript Processor

The RDF-Connect ecosystem already offers many JavaScript/TypeScript processors.
We provide a handy way to discover existing processors on the [Discover Existing Work](./discover-existing-work.md) page.

Imagine you want to use the [rdfc:LogProcessorJs](https://github.com/rdf-connect/log-processor-ts) published on [npm](https://www.npmjs.com/package/@rdfc/log-processor-ts) in your pipeline configuration.
To use the `rdfc:LogProcessorJs` in your RDF-Connect pipeline, you first need to install the `@rdfc/log-processor-ts` package using npm:
```bash
npm install @rdfc/log-processor-ts
```

Next, you need to import the processor's semantic definition into your pipeline configuration using an `owl:imports` statement:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./node_modules/@rdfc/log-processor-ts/processor.ttl>.
```

Now you can attach the `rdfc:LogProcessorJs` to the `rdfc:NodeRunner` in your pipeline configuration using the `rdfc:processor` property in the blank node that represents the runner-processors pair:

```turtle
### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:NodeRunner;
       rdfc:processor <logger>;
   ].
```

Next, you need to define the channels the processor will use to read and write data.
As the log processor will read data from one channel, log it to the RDF-Connect logging system, and write the data to another channel, you need to define two channels in your pipeline configuration:

```turtle
### Define the channels
<channel1> a rdfc:Writer, rdfc:Reader.
<channel2> a rdfc:Writer, rdfc:Reader.
```

Finally, you need to define and configure the processor instantiation itself.

```turtle
### Define the processors
# Processor to log the output
<logger> a rdfc:LogProcessorJs;
      rdfc:reader <channel1>;
      rdfc:writer <channel2>;
      rdfc:level "info";
      rdfc:label "output".
```

The complete pipeline configuration looks like this:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./node_modules/@rdfc/js-runner/index.ttl>.
<> owl:imports <./node_modules/@rdfc/log-processor-ts/processor.ttl>.

### Define the channels
<channel1> a rdfc:Writer, rdfc:Reader.
<channel2> a rdfc:Writer, rdfc:Reader.

### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:NodeRunner;
       rdfc:processor <logger>;
   ].

### Define the processors
# Processor to log the output
<logger> a rdfc:LogProcessorJs;
      rdfc:reader <channel1>;
      rdfc:writer <channel2>;
      rdfc:level "info";
      rdfc:label "output".
```


### Example: Configuring a Python Processor

Imagine you want to use the [rdfc:LogProcessorPy](https://github.com/rdf-connect/log-processor-py) published on [PyPI](https://pypi.org/project/rdfc_log_processor/) in your pipeline configuration.
To use the `rdfc:LogProcessorPy` in your RDF-Connect pipeline, you first need to install the `rdfc_log_processor` package using pip or uv:

```bash
uv add rdfc_log-processor
```

Next, you need to import the processor's semantic definition into your pipeline configuration using an `owl:imports` statement.
We again assume you have a virtual environment set up in the `.venv` folder and that you are using Python 3.13.

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./.venv/lib/python3.13/site-packages/rdfc_log_processor/processor.ttl>.
```

Now you can attach the `rdfc:LogProcessorPy` to the `rdfc:PyRunner` in your pipeline configuration using the `rdfc:processor` property in the blank node that represents the runner-processors pair:

```turtle
### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:PyRunner;
       rdfc:processor <logger>;
   ].
```

Next, you need to define the channels the processor will use to read and write data.
As the log processor will read data from one channel, log it to the RDF-Connect logging system, and write the data to another channel, you need to define two channels in your pipeline configuration:

```turtle
### Define the channels
<channel1> a rdfc:Writer, rdfc:Reader.
<channel2> a rdfc:Writer, rdfc:Reader.
```

Finally, you need to define and configure the processor instantiation itself.

```turtle
### Define the processors
# Processor to log the output
<logger> a rdfc:LogProcessorPy;
      rdfc:reader <channel1>;
      rdfc:writer <channel2>;
      rdfc:level "info";
      rdfc:label "output".
```

The complete pipeline configuration looks like this:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./.venv/lib/python3.13/site-packages/rdfc_runner/index.ttl>.
<> owl:imports <./.venv/lib/python3.13/site-packages/rdfc_log_processor/processor.ttl>.

### Define the channels
<channel1> a rdfc:Writer, rdfc:Reader.
<channel2> a rdfc:Writer, rdfc:Reader.

### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:PyRunner;
       rdfc:processor <logger>;
   ].

### Define the processors
# Processor to log the output
<logger> a rdfc:LogProcessorPy;
      rdfc:reader <channel1>;
      rdfc:writer <channel2>;
      rdfc:level "info";
      rdfc:label "output".
```


### Example: Configuring a Java/Kotlin Processor

Imagine you want to use the [rdfc:TestProcessor](https://github.com/rdf-connect/template-processor-jvm) implemented in the [template-processor-jvm](https://github.com/rdf-connect/template-processor-jvm) repository in your pipeline configuration, which logs the data from a channel and writes it to another channel.
To use the `rdfc:TestProcessor` in your RDF-Connect pipeline, you first need to install the `rdfc:TestProcessor` package using Maven or Gradle.

Create a `build.gradle` file with the following content:

```groovy
plugins {
    id 'java'
}

repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }  // if your processors are on GitHub
}
dependencies {
    implementation("com.github.rdf-connect:template-processor-jvm:master-SNAPSHOT:all")
}

tasks.register('copyPlugins', Copy) {
    from configurations.runtimeClasspath
    into "$buildDir/plugins"
}

configurations.all {
    resolutionStrategy.cacheChangingModulesFor 0, 'seconds'
}
```

Then run the following command to download the dependencies:

```bash
gradle copyPlugins
```

If you do not want to use Gradle, you can also download the `rdfc:TestProcessor` JAR file directly from JitPack and place it in the `build/plugins` folder in your project directory.

Next, you need to import the processor's semantic definition into your pipeline configuration using an `owl:imports` statement:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <./build/plugins/template-processor-jvm-master-SNAPSHOT-all.jar>.
```

Now you can attach the `rdfc:TestProcessor` to the `rdfc:JvmRunner` in your pipeline configuration using the `rdfc:processor` property in the blank node that represents the runner-processors pair:

```turtle
### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:JvmRunner;
       rdfc:processor <logger>;
   ].
```

Next, you need to define the channels the processor will use to read and write data.
As the log processor will read data from one channel, log it to the RDF-Connect logging system, and write the data to another channel, you need to define two channels in your pipeline configuration:

```turtle
### Define the channels
<channel1> a rdfc:Writer, rdfc:Reader.
<channel2> a rdfc:Writer, rdfc:Reader.
```

Finally, you need to define and configure the processor instantiation itself.

```turtle
### Define the processors
# Processor to log the output
<logger> a rdfc:TestProcessor;
      rdfc:reader <channel1>;
      rdfc:writer <channel2>;
      rdfc:name "World".
```

The complete pipeline configuration looks like this:

```turtle
@prefix rdfc: <https://w3id.org/rdf-connect#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

### Import runners and processors
<> owl:imports <https://javadoc.jitpack.io/com/github/rdf-connect/jvm-runner/runner/master-SNAPSHOT/runner-master-SNAPSHOT-index.jar>.
<> owl:imports <./build/plugins/template-processor-jvm-master-SNAPSHOT-all.jar>.

### Define the channels
<channel1> a rdfc:Writer, rdfc:Reader.
<channel2> a rdfc:Writer, rdfc:Reader.

### Define the pipeline
<> a rdfc:Pipeline;
   rdfc:consistsOf [
       rdfc:instantiates rdfc:JvmRunner;
       rdfc:processor <logger>;
   ].

### Define the processors
# Processor to log the output
<logger> a rdfc:TestProcessor;
      rdfc:reader <channel1>;
      rdfc:writer <channel2>;
      rdfc:name "World".
```
