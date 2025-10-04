---
title: "{{title}}"
date: "{{date}}"
excerpt: "{{excerpt}}"
tags: [{{#each tags}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]
author: "{{author}}"
category: "{{category}}"
featuredImage: "{{featuredImage}}"
published: {{published}}
---

# {{title}}

{{#if featuredImage}}
![{{title}}]({{featuredImage}})
{{/if}}

## Introduction

{{introduction}}

{{#if includeTableOfContents}}
## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Main Content](#main-content)
- [Conclusion](#conclusion)
{{/if}}

## Prerequisites

Before we begin, make sure you have:

{{#each prerequisites}}
- {{this}}
{{/each}}

## Main Content

{{mainContent}}

{{#if codeExamples}}
## Code Examples

{{#each codeExamples}}
### {{title}}

```{{language}}
{{code}}
```

{{description}}

{{/each}}
{{/if}}

{{#if tips}}
## Tips and Best Practices

{{#each tips}}
- {{this}}
{{/each}}
{{/if}}

{{#if troubleshooting}}
## Troubleshooting

{{#each troubleshooting}}
### {{issue}}

**Problem:** {{problem}}

**Solution:** {{solution}}

{{/each}}
{{/if}}

## Conclusion

{{conclusion}}

{{#if furtherReading}}
## Further Reading

{{#each furtherReading}}
- [{{title}}]({{url}})
{{/each}}
{{/if}}

{{#if includeAuthorBio}}
---
## About the Author

{{authorBio}}
{{/if}}