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

## How to use the CSP build

## Things to keep in mind when using the CSP build

## Wrapping up


