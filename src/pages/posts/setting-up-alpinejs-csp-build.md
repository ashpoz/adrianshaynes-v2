---
layout: ../../layouts/BlogPostLayout.astro
title: 'How to set up Alpine.js using the CSP build.'
date: 'November 3rd, 2024'
sortDate: '2024-11-03'
caption: 'Alpine.js offers a CSP (Content Security Policy) build that is more secure, while offering many of the same benefits of using the framework.'
tags: 'Alpine.js, CSP, Content Security Policy, Frontend, Web Development, JavaScript'
---

Lightweight JavaScript framework, Alpine.js is awesome. However, there are security concerns using the framework due to violating the "unsafe-eval" Content Security Policy. Luckily, the Alpine.js team offers a CSP (Content Security Policy) build. 

In this article, I will show you how to install, and start using the CSP build in your project!

## First off, what is Content Security Policy and why should I care about it?
Content Security Policy is a security standard that helps prevent cross-site scripting attacks, and clickjacking. Cross-site scripting (XSS) attacks are when a hacker injects malicious code into a website which can give them the ability to steal personal user information, phishing attacks, and spreading malware. 

Certain JavaScript approaches such as inline JavaScript, plus the `eval()` and `Function()` APIs can lead to XSS attacks. As stated on the <a href="https://alpinejs.dev/advanced/csp" rel="noopener noreferrer" target="_blank">Alpine.js website</a>, Alpine.js uses the `Function()` constructor which violates "unsafe-eval", a recommended Content Security Policy keyword used to prevent these types of attacks. 

Needless to say, if you have a Content Security Policy header with the "unsafe-eval" implemented on your application you will not be able to use Alpine.js without using the CSP build. 

Luckily for us, Alpine.js includes a CSP build that avoids security vulnerabilities while still utilizing the magic of the framework.


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

>**Note:** `@alpinejs/csp` assumes you are using a build tool (like Vite or Webpack) to interpret the base specifier (the `@` symbol in the module). If you aren't using a build tool, simply include the path to the node module: `./node_modules/@alpinejs/csp/dist/module.esm.js`

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

## How to build Alpine.js components using the CSP build
So what would this look like in a real project? Let's build a modal component to give us a better sense of what this would look like. Our modal component should open on the click of a button, and have the ability to close with a button inside the modal. 

Let's create a `Modal.js` file and add it to a `components` directory. Inside `Modal.js`, let's add some basic boilerplate code just to make sure it works:

```javascript
export default () => ({
  init() {
    console.log('its me, your Modal component!')
  }
})
```

In the above code, we are exporting our component, and using the built in `init()` method that will automatically fire whenever your Alpine code is mounted. 

Now in our markup, let's add our component like so:

```html
<div x-data="Modal"></div>
```

Now let's import our `Modal.js` component and initialize it in our main JavaScript file:

```javascript
import Modal from './components/Modal.js'
 
window.Alpine = Alpine

// here is where you init your components,
// after window.Alpine and before Alpine.start()
Alpine.data('Modal', Modal)
 
Alpine.start()
```

If you see your Modal's `console.log()` while testing the page, then your Alpine component is officially working! Okay now let's get to the good stuff. 

Inside our Modal component markup, let's add a button to trigger opening our Modal, and a `<dialog>` element which will store our Modal contents.

```html
<div x-data="Modal">
  <button>Open Modal</button>
  <template x-teleport="body">
      <dialog x-ref="dialog">
        <div>Modal contents...</div>
        <button>Close Modal</button>
      </dialog>
  </template>
</div>
```
 
>**Note:** If you're not familiar with the `<dialog>` element it's a super easy way to quickly create a modal. It includes easy to use methods for opening and closing, a pseudo element `::backdrop` for easily styling the overlay, and the ESC key to close, and keyboard focus trap works out of the box. Also, it has [baseline support](https://caniuse.com/?search=dialog) for modern browsers.

We are using Alpine directive `x-teleport` here to transport our template to the body, since we want the modal's backdrop to take up the entire screen. More about `x-teleport` <a href="https://alpinejs.dev/directives/teleport" rel="noopener noreferrer" target="_blank">here.</a>

Also we are adding `x-ref` to our `<dialog>` element so we can target it in our Alpine component code. If you are familiar with React, this is like using `useRef`.

Now jumping into our `Modal.js` file, let's configure our open and close logic. 

```javascript
export default () => ({
  close() {
    this.$refs.dialog.close()
    },
  open() {
    this.$refs.dialog.showModal()
  }
})
```

Here, we are adding an `open()` and `close()` method, and referencing Alpine's `$refs` magic for the dialog ref that we added in the previous step. 

Now let's hook up the the `open()` and `close()` methods to our markup by adding Alpine `@click` event attributes to our buttons like so.

```html
<div x-data="Modal">
  <button @click="open">Open Modal</button>
  <template x-teleport="body">
      <dialog x-ref="dialog">
        <div>Modal contents...</div>
        <button @click="close">Close Modal</button>
      </dialog>
  </template>
</div>
```

Here is a codepen with our working example!

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="BaXGyjO" data-pen-title="Alpine.js CSP Build - Modal Component" data-preview="true" data-user="ashpoz" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/ashpoz/pen/BaXGyjO">
  Alpine.js CSP Build - Modal Component</a> by Adrian Haynes (<a href="https://codepen.io/ashpoz">@ashpoz</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Wrapping up
In this article, we tackled:
- What is Content Security Policy (CSP) and why it matters for web security
- How to set up Alpine's CSP build
- The key differences between regular Alpine and Alpine's CSP build
- A practical example using the Modal

The CSP requires more setup, with the logic in it's own JavaScript files, it does include benefits:
- Bettery security thru CSP compliance
- Separation of concerns between HTML and JavaScript
- Structured component organization

Thanks for reading, and happy coding! ✌️
