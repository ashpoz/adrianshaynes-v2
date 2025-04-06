---
layout: ../../layouts/BlogPostLayout.astro
title: 'Handling State Across Page Loads with Alpine.js Using the Persist Plugin'
date: 'March 15, 2025'
caption: 'In this article, we explore how to use the Persist plugin, an Alpine.js plugin that allows you to save data across page loads.'
tags: 'Alpine.js, Frontend, Web Development, JavaScript, Persist, Alpine Plugins, Cookies, Local Storage, eCommerce.'
---

## Overview
Picture this, you are using Alpine.js to handle state of your website or application. But wait, what happens when the user navigates to another page or refreshes the page? Your state is GONE 😢   

Okay, you probably know this. But we all know there is a considerable amount of work that goes into building logic to persist state when building an application from scratch.

This is where the Persist plugin comes in. This makes it possible to tie your Alpine properties to `localStorage` so that you can access the data even when a user navigates to another page. 

In this article, we will explore how to set up and use the Persist plugin, and a practical example of using the plugin to track state for a simple cart for a hypothetical eCommerce application. 

## Installing the Persist plugin
You can install and load the Persist plugin using a CDN or via npm.

### CDN
```html
<!-- Alpine Plugins -->
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### NPM
```bash
npm install @alpinejs/persist
```

And initialize it:
```javascript
// ./src/index.js

import persist from '@alpinejs/persist'
import Alpine from 'alpinejs'

window.Alpine = Alpine

// NOTE: make sure to initialize plugins BEFORE running Alpine.start()
Alpine.plugin(persist)
Alpine.start()
``` 

## Quick example
On the official Alpine.js Persist docs, they provide a quick example using everyone's favorite counter component. 

```html
<div x-data="{ count: $persist(0) }">
    <button x-on:click="count++">Increment</button>
 
    <span x-text="count"></span>
</div>
```

As you can see, all you really have to do is wrap the `count` property's value with the `$persist` magic function. 

What this does is automatically saves your count property to `localStorage` with a the key `_x_count`. So basically, the using the Persist plugin skips the need of using the `setItem` and `getItem` methods to set and retrieve items you want to save in `localStorage`. 

You can set a custom key by adding `.as()` to the end of your persist property like so:

```html
<div x-data="{ count: $persist(0).as('counter-orlok')">
```

## Storing as Cookies instead of localStorage
This is cool, but what if we need to use browser cookies instead? Luckily, they provide an example on how to set that up. 

Here is the example they provide in their docs:

```html
<script>
    window.cookieStorage = {
        getItem(key) {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split("=");
                if (key == cookie[0].trim()) {
                    return decodeURIComponent(cookie[1]);
                }
            }
            return null;
        },
        setItem(key, value) {
            document.cookie = key+' = '+encodeURIComponent(value)
        }
    }
</script>
 
<div x-data="{ count: $persist(0).using(cookieStorage) }">
    <button x-on:click="count++">Increment</button>
 
    <span x-text="count"></span>
</div>
```

This is awesome because browser cookies provide some added benefits such as an expriy date, security measures such as limiting the use of manipulating the data from another domain, and only allowing the cookies to work on https. 

**Note:**
Cookies are limited to 4kb, so this option may not be suitable for larger amounts of data. 

## Ecommerce Cart Example 
Now that we have a general understanding on how the Persist plugin, let's explore a simple example.

Let's say you are building a simple eCommerce app that allows users to add items to their cart and continue browsing before checking out.

### Build Our Products Data
First, we need to set up our products data. At a minimum, we need a product name, price, description, and a UUID (Universally Unique Identifier), which serves as an ID for your product.

Here is some dummy data to represent our product data:
```javascript
products: [
{
    description: "This is the comfiest T-Shirt of all time",
    name: "T-Shirt",
    price: "$20",
    uuid: "123",
},
{
    description: "This is the coolest jean jacket of all time",
    name: "Jean Jacket",
    price: "$50",
    uuid: "456",
},
{
    description: "This is the spiffiest cardigan of all time",
    name: "Cardigan",
    price: "$40",
    uuid: "789",
},
],
```

Now, we can loop over our products using Alpine.js and output them on the page!

### Render Products and Add To Cart Forms
We will set up each product with its own form to handle the add-to-cart logic. This way, we can easily pass product data as Form Data using inputs.

First, let's move our product data into an Alpine component, so we can easily loop over the data. 

```javascript
Alpine.data("Products", () => ({
  products: [
    {
      description: "This is the comfiest T-Shirt of all time",
      name: "T-Shirt",
      price: "$20",
      uuid: "123",
    },
    {
      description: "This is the coolest jean jacket of all time",
      name: "Jean Jacket",
      price: "$50",
      uuid: "456",
    },
    {
      description: "This is the spiffiest cardigan of all time",
      name: "Cardigan",
      price: "$40",
      uuid: "789",
    },
  ],
}));
```

Now, let's build our markup to render the product forms:
```html
<div x-data="Products">
    <template x-for="product in products">
        <form x-data="Product" @submit.prevent="addToCart">
        <fieldset>
            <legend x-text="product.name"></legend>
            <p x-text="product.description"></p>
            <p x-text="product.price"></p>
            <input type="number" name="quantity" value="1" />
            <input type="hidden" name="name" :value="product.name" />
            <input type="hidden" name="uuid" :value="product.uuid" />
            <input type="hidden" name="price" :value="product.price" />
            <button type="submit">Add to Cart</button>
        </fieldset>
        </form>
    </template>
</div>
```

Let's break this down. We are looping over the product data using `x-for` and rendering forms for each product. 

Inside the form markup, you will find the `@submit.prevent` event with the method `addToCart` which we will set up later. 

Then, we print out the product data using `x-text` and then, pass along the data using inputs. Notice name, and price, and uuid are hidden, since we don't want the user the ability to change those values. 

### Set up Product Alpine.js component
Now let's set up the logic for the Products form. We need to capture this data, and send it to our Cart store somehow. 

```javascript
Alpine.data("Product", () => ({
  addToCart() {
    const formData = new FormData(this.$el);
    this.$dispatch("addedtocart", {
      name: formData.get("name"),
      uuid: formData.get("uuid"),
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
    });
  },
}));
```

Here, I'm using custom events to track our state. Alpine.js provides the $dispatch method, which simplifies the syntax for creating custom events.'

I've created an event name called `addedtocart` and sending an object with all of our product data we will need to track in our Cart Store. 

The data is captured by using the `FormData` constructor where I'm passing `this.$el` which references our component element which is a form element, and then using the `get()` method to grab each input value. 

### Set up our Cart Store
Cool, now that we are sending an event, we need to "listen" for that event, and use the data. 

Let's set up our Cart Store using the Persist Plugin. 

```javascript
Alpine.store("cart", {
  items: Alpine.$persist([]).as("cart"),
  init() {
    document.addEventListener("addedtocart", (event) => {
      // do something with this data!
      console.log(event.detail)
    });
  },
});
```

We have created a store called `Cart` and added a property called `items` which is using the `$persist` plugin so we can save the after page load. 

Then, using the `init()` Alpine.js lifecycle hook which fires when the component initializes, we are going to add an event listener which will listen for our `addedtocart` custom event. Let's just console log the data for now. 

**NOTE:** Any data you send into a custom event, can be accessed using `event.detail`.

When you open up your console, you should see the data appear whenever you click the Add To Cart button with the appropiate product data. 

### Update our Cart Items
Let's now update our cart store items! To do this, let's create a method in our store called `addItem`.

```javascript
addItem(data) {
    const matchingProduct = this.items.find((item) => item.uuid == data.uuid);

    if (matchingProduct) {
        matchingProduct.quantity =
        Number(matchingProduct.quantity) + Number(data.quantity);
    } else {
        this.items = [data, ...this.items];
    }
},
```

This method should accept the data we pass along with our custom event and then add it to our `items` property. Which is what we are doing here: `this.items = [data, ...this.items]`

Also, if the same item is added, we want to instead update the quantity instead of adding to our items array. In order to do this, we first use the `find` method to find an object in our items array that has a matching `uuid`. If there is an existing matching product, we want to simply update the `quantity`. 

Great! Now let's add this method to our listener like so:

```javascript
document.addEventListener("addedtocart", (event) => {
    this.addItem(event.detail);
});
```

### Render our Cart Items
Let's render our cart items on the page so we can see what's happening here. Below your `Products` component, add the following: 

```html
<ul>
    <template x-for="item in $store.cart.items" :key="item.uuid">
        <li>
            <span x-text="item.name"></span>, Quantity:
            <span x-text="item.quantity"></span>
        </li>
    </template>
</ul>
```

This loops over our cart store items and outputs each product's name and quantity. Try adding a few products and you should see the products on the page.

Now, try refreshing the page, and you should see the products persist on the page!

**Wow!!!**

### Bonus: Add Remove Item Logic
If you'd like, we can also allow the user to remove any added items from their cart. The process will be very similar to how we set up our `addItem` method. 

Let's first wrap our store cart items output inside an Alpine.js component.
```html
<div x-data="Cart">
    <ul>
        <template x-for="item in $store.cart.items" :key="item.uuid">
            <li>
                <span x-text="item.name"></span>, Quantity:
                <span x-text="item.quantity"></span>
                <button @click="removeFromCart" :data-uuid="item.uuid">
                    Remove
                </button>
            </li>
        </template>
    </ul>
</div>
```

Then, add a button that will handle our remove logic. We will need to access the item's `uuid` in order to know which product to remove, so let's pass that in as a data attribute. Add the following code:

```javascript
<div x-data="Cart">
    <ul>
        <template x-for="item in $store.cart.items" :key="item.uuid">
            <li>
                <span x-text="item.name"></span>, Quantity:
                <span x-text="item.quantity"></span>
                <!-- Add this! -->
                <button @click="removeFromCart" :data-uuid="item.uuid">
                    Remove
                </button>
            </li>
            <!--  -->
        </template>
    </ul>
</div>
```

Now, let's set up our `removeFromCart` method in a `Cart` component:

```javascript
Alpine.data("Cart", () => ({
  removeFromCart() {
    this.$dispatch("removedfromcart", {
      uuid: this.$event.currentTarget.dataset.uuid,
    });
  },
}));
```

This dispatches an event called `removedfromcart`, and passes in the `uuid` which we are grabbing from the button's data attribute.

Back, in your Cart store, add the following code:
```javascript
removeItem(data) {
    this.items = this.items.filter((item) => data.uuid != item.uuid);
},
```

This uses the `filter` method to search through the `items` array of objects, and only returns the items that do NOT equal the passed in data's uuid. Essentially, this creates a new array but omits the item with the matching uuid. 

Add the `removeItem` into the `removedfromcart` listener like so: 

```javascript
init() {
    document.addEventListener("addedtocart", (event) => {
        this.addItem(event.detail);
    });
    // Add this!
    document.addEventListener("removedfromcart", (event) => {
        this.removeItem(event.detail);
    });
    //
},
```

That's basically it! You can see a working example here:

[![Edit alpinejs-persist-plugin-cart-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/alpinejs-persist-plugin-cart-example-9g8hp6?embed=1&file=%2Findex.html)

## Wrapping Up

The Persist plugin is super helpful when you need to save state across webpages, and page reloads.

Thanks for reading!
