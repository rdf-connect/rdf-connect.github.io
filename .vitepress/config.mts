import {defineConfig} from 'vitepress';
import {withMermaid} from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
   title: "RDF-Connect",
   description: "Building Streaming and Cross-Environment Data Processing Pipelines with RDF-Connect",
   cleanUrls: true,
   themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: {
         light: '/logo.svg',
         dark: '/logo-dark.svg',
         alt: 'RDF-Connect',
      },
      nav: [
         {text: 'Home', link: '/'},
         {text: 'Examples', link: '/markdown-examples'}
      ],

      sidebar: [
         {
            text: 'Introduction',
            items: [
               {text: 'What is RDF-Connect?', link: '/what-is-rdf-connect'},
               {text: 'Architecture', link: '/architecture'},
            ]
         },
         {
            text: 'Getting Started',
            items: [
               {text: 'Quick Start', link: '/quick-start'},
               {text: 'Configuration', link: '/configuration'},
               {text: 'Discover Existing Work', link: '/discover-existing-work'},
            ]
         },
         {
            text: 'References',
            items: [
               {text: 'Specification', link: 'https://rdf-connect.github.io/specification/'},
               {text: 'GitHub', link: 'https://github.com/rdf-connect'},
            ]
         },
      ],

      socialLinks: [
         {icon: 'github', link: 'https://github.com/rdf-connect'}
      ]
   }
}));
