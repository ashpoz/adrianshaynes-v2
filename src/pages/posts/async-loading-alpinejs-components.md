---
layout: ../../layouts/BlogPostLayout.astro
title: 'How to lazy-load Alpine.js components using the Async Alpine plugin'
date: 'November 17th, 2024'
sortDate: '2024-11-17'
caption: 'In this article, we look into how to leverage the plugin, Async Alpine, in order to lazy-load Alpine.js components.'
tags: 'Alpine.js, Frontend, Web Development, JavaScript, Async Alpine, Alpine Plugins, Lazy-Loading'
---

## Overview
As your component library grows, you will inevitably start looking for ways to optimize your JavaScript bundle size.

While lazy-loading components is a built-in feature in many JavaScript frameworks like React and Vue, Alpine.js doesn't currently offer this capability natively. However, a plugin called [Async Alpine](https://async-alpine.dev/) makes this possible.

## Installing Async Alpine
You can install and load either using their CDN, or via npm.

Copy the following script tags in order to load via CDN:
```html
<script defer src="https://cdn.jsdelivr.net/npm/async-alpine@2.x.x/dist/async-alpine.script.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

>**Note:** The Async Alpine script must be loaded first

In order to install via npm, run this command in the root of your project:
```bash
npm install async-alpine
```

If you don't already have Alpine.js installed, run the following:
```bash
npm install alpinejs
```

Then, import Async Alpine into your bundle:
```javascript
// ./src/index.js

import AsyncAlpine from 'async-alpine';
import Alpine from 'alpinejs';
Alpine.plugin(AsyncAlpine);
Alpine.start();
```

>**Note:** `Alpine.plugin(AsyncAlpine)` should be initialized before `Alpine.start()`

>**Also Note:** `alpinejs` and `async-alpine` assume you are using a build tool (like Vite or Webpack) to interpret module imports using the @ symbol. If you aren't using a build tool, simply include the path to the node modules: 
```javascript
import AsyncAlpine from '../node_modules/async-alpine/dist/async-alpine.esm.js'
import Alpine from '../node_modules/alpinejs/dist/module.esm.js'
```

## How to use Aysnc Alpine in your project
In order to make your Alpine component an async component, add the `x-load` attribute to your html:
```html
<div
  x-load
  x-data="MyComponent"
>
  <div x-text="message"></div>
</div>
```

This assumes you are buidling your Alpine.js components as ES Modules like so:
```javascript
// ./src/alpine/components/MyComponent.js

export default function MyComponent() {
  return {
    message: '',
    init() {
      this.message = 'init my component'
    }
  }
}
```

Now, we have to make Async Alpine aware of your component. There are several ways to do this.

### Inline
One of the more straightforward ways to load the component, is by directly including the path to your Alpine component's ES Module file like so:
```html
  <div
    x-load
    x-data="MyComponent"
    x-load-src="/src/alpine/components/MyComponent.js"
  >
    <div x-text="message"></div>
  </div>
```

### Alias Loading
Alias loading is helpful if all components are in a specific folder structure.

For example, let's assume all of our components are stored in the following directory: `./src/alpine/components/[COMPONENT NAME].js`

Then, we could include the following in our main JavaScript file like so:
```diff
import AsyncAlpine from '../node_modules/async-alpine/dist/async-alpine.esm.js'
import Alpine from '../node_modules/alpinejs/dist/module.esm.js'

Alpine.plugin(AsyncAlpine)
+Alpine.asyncAlias('./src/alpine/components/[name].js')
Alpine.start()
```

You can view the other usage options here: [https://async-alpine.dev/docs/usage/](https://async-alpine.dev/docs/usage/)

## Loading Strategies
Loading strategies help you control exactly when and how your components load, allowing you to optimize your application's performance. 

By default, your Async Alpine component is loaded as **Eager**, which means that if the component is present on the page, it will be loaded asynchronously with the highest priority.

**Idle** is perfect for non-critical components that aren't essential for initial load. Async Alpine uses `requestIdleCallback` to load components during the browser's "idle" periods. For browsers that don't support `requestIdleCallback` yet (Safari doesn't currently), an arbitrary `200ms` delay will be used.

**Visible** will utilize `IntersectionObserver` to load the component only if it's in view. 

To implement a loading strategy, add a value to your `x-load` attribute like so:
```diff
  <div
+    x-load="visible"
    x-data="MyComponent"
    x-load-src="/src/alpine/components/MyComponent.js"
  >
    <div x-text="message"></div>
  </div>
```

Aysync Alpine also allows you to load components at specific viewports, DOM events, and you can even combine loading strategies.  

To learn more about Async Alpine's loading strategies, check out their docs: [https://async-alpine.dev/docs/strategies/](https://async-alpine.dev/docs/strategies/)


## Wrapping Up
Async Alpine is a super awesome tool for projects that utilize many Alpine.js components. It's one of the first things I do when setting up an Alpine.js project. 

To learn more about the Async Alpine plugin, head over to their docs: [https://async-alpine.dev/docs/](https://async-alpine.dev/docs/)

Thanks for reading, and happy coding ✌️