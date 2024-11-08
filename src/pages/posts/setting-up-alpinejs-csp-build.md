---
layout: ../../layouts/BlogPostLayout.astro
title: 'How to set up Alpine JS using the CSP build.'
date: 'November 3rd, 2024'
caption: 'Alpine.js offers a CSP (Content Security Policy) build that is more secure, while offering many of the same benefits of using the framework.'
---

Lightweight JavaScript framework, Alpine.js is awesome. However, there are security concerns using the framework due to violating the "unsafe-eval" Content Security Policy. Luckily, the Alpine.js team offers a CSP (Content Security Policy) build. 

In this article, I will show you how to install, and start using the CSP build in your project!

## First off, what is Content Security Policy and why should I care about it?
Content Security Policy is a security standard that helps prevent cross-site scripting attacks, and clickjacking. Cross-site scripting (XSS) attacks are when a hacker injects malicious code into a website which can give them the ability to steal personal user information, phishing attacks, and spreading malware. 

Certain JavaScript approaches such as inline JavaScript, plus the `eval()` and `Function()` APIs can lead to XSS attacks. As stated on the <a href="https://alpinejs.dev/advanced/csp" rel="noopener noreferrer" target="_blank">Alpine.js website</a>, Alpine.js uses the `Function()` constructor which is violates "unsafe-eval", a recommended Content Security Policy keyword used to prevent these types of attacks. 

Needless to say, if you have a Content Security Policy header with the "unsafe-eval" implemented on your application you will not be able to use Alpine.js without using the CSP build. 

Luckily for us, Alpine.js includes a CSP build that avoids security vunerabilities while still utilizing the magic of the framework.


## Okay, enough of my yapping. Let's install Alpine.js using their CSP build!
In this tutorial, we will install the CSP build via NPM but you can also include via CDN like so:
```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
``` 

To install the build with npm, use the following command while in the root of your project:
```bash
npm install @alpinejs/csp
```

To initialize the CSP build in your project, include the following code in your main JavaScript file.
```javascript
import Alpine from '@alpinejs/csp'
 
window.Alpine = Alpine
 
Alpine.start()
```

That's pretty much it! The main difference in writing Alpine.js using the CSP build, is that you will write your JavaScript logic in a separate file, and reference Alpine's properties and methods by name only. You will NOT be able to add any expressions directly to your HTML. 

For example, this is how a counter works in regular Alpine:
```html
<div x-data="{ count: 1 }">
    <button @click="count++">Increment</button>
    <span x-text="count"></span>
</div>
```

Notice the `x-data` contains an object, and the `@click` attribute contains a JavaScript expression. This will not work in Alpine's CSP build. Instead, you will need to make the following changes to your code:

```html
<div x-data="counter">
    <button @click="increment">Increment</button>
    <span x-text="count"></span>
</div>
```

Then, in your JavaScript, you will add the Alpine logic like so:
```javascript
Alpine.data('counter', () => ({
    count: 1,
 
    increment() {
        this.count++
    },
}))
```

In this example, we can scope logic to our counter component by using `Alpine.data('counter')`, and creating properties like `count` and methods like `increment` in an object. 

Obviously, we lose out on adding logic directly in our html, but I kinda like separating the logic from the markup and the JavaScript personally. This way, we can still easily see what component the HTML is attached to in the markup, along with any event listeners like `@click`, and keep things clean by storing actual JavaScript code inside a JavaScript file. 

## A better way to use the CSP build
So what would this look like in a real project?  

## Things to keep in mind when using the CSP build

## Wrapping up


