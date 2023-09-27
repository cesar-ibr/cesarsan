# Demystifying VDOM

## Overview
With modern web development we take for granted the Component-Driven Development pattern that libraries and frameworks like Angular, React and Vue offer to all developers today.  
I'm worried that new developers (but also old ones) don't care too much about **what** these frameworks do and most importantly, **why** they do it. The ease with which we use these libraries and tools *blinds* us to the point that most developers don't know what they use.

In addition, this lack of knowledge lead us to trivial debates about the use of these tools and I'm also talking about blog posts like "React vs Vue", "Vue vs React" or "Top 3 developer tools in 202X" that don't really help to get a better idea on the actual implementation of these frameworks.

> How can we make better choices if we don't know what we're buying? How can we argue about "React vs. Vue" if we don't know how they work under the hood?

That's why I've decided to make this article that will cover the what and why on Virtual DOM.

**Topics**
- What’s the DOM
- Use Case: Display Bitcoin Prices
- A Real-World Feature
- Virtual DOM is Cheaper than Real DOM
- Alternatives to VDOM?

## What’s the DOM
The Document Object Model is a Web API available in *browsers* to manipulate the HTML document dynamically. You can access this API directly from the browser’s *JavaScript* engine through the object `window.document` or just `document`.
Making a simple DOM manipulation looks like this:

```javascript
const h1 = document.getElementById('header');
h1.innerText = 'Hello There!';
```

> The [Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) is not part of the core javascript language. It's just that browsers make it accessible from the JavaScript runtime.


Having this direct access to DOM elements is great for operations where you just need to modify attributes on an HTML element like its color, position or font-size. It's also convenient for changing its content very quickly. We can easily abstract these operations into a set of functions that can help us to create HTML elements from default templates.

## Use Case: Display Bitcoin Prices
In order to better understand DOM operations like *creating* and *updating* HTML elements I'm going to use a simple example which will cover essential parts of contemporary web applications such as **Data-Fetching**, **State Management** and **App Rendering**. For our example I'm going to use a simple app that lists the Bitcoin Price Index (BPI) in three prices: Dollars, Pounds and Euros. Once we finish our small app, you're going to see why modern front-end libraries like React and Vue implement a Virtual DOM to render their components.

> The API used in this example is from [Coindesk](https://www.coindesk.com/coindesk-api/) simply because you don't need an API Key to use it.
```javascript
// HTML Template
const fillTemplate = (bpi) => `
  <h1>Bitcoin Price Index</h1>
  <p><strong>USD: </strong>&dollar;${bpi.USD.rate_float}</p>
  <p><strong>GBP: </strong>&pound;${bpi.GBP.rate_float}</p>
  <p><strong>EUR: </strong>&euro;${bpi.EUR.rate_float}</p>
  `;

// Fetch BPI data
const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Fill Template with Data
async function renderData() {
  const data = await fetchData();
  const container = document.getElementById('container');
  const filledTemplate = fillTemplate(data.bpi);
  container.innerHTML = filledTemplate;
}

renderData();
```
> Note: The code in this article is just for explanatory purposes. I don't recommend using it in a real application.
> See this code snippet [live here](https://codepen.io/cesar-sanchezibr/pen/ZEyYXvd)

By the way, coding this example wouldn't have been easy a few years ago. It's thanks to the rapid catch-up that web browsers have done recently regarding [ECMAScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Resources) that we can now *fetch data* from an external service and use *html templates* with a few lines of code.

In real-world applications, we need to show data based on conditions and rules, we need to reference other templates and even respond to actions made by users in our app.

### A Real-World Feature
So far our example covers a very basic use case which is re-using templates among the code base. However, modern web is interactive. It's not just about showing data in a page, it's also about responding to user's actions. Also, it doesn't make sense to use a Virtual DOM just for one template. That's why we're going to add just the complexity we need in order to explain how JavaScript perform better with HTML Elements in a Virtual DOM than HTML Elements in the real DOM.

The app's new feature is going to be a simple button that *toggles* our template's view from open to close and viceversa. The behaviour of our new feature is the following:

> When we first load the prices, we show only the price in dollars. When the user clicks on toggle-button, the other two prices (pounds and euros) are shown. If the user clicks again on toggle-button, we show just the price in dollars.

Extra points to you if you can think about a solution without using a js library.

Let's start by listing what we need to do in order to implement this new feature:
- Interact with another HTML element (toggle-button)
- Manage a state in the app (toggle between open and close)
- Decouple the rendering process from data-fetching (being responsive) 

All of this comes out-of-the-box with frontend libraries like React and Vue. The reason we're not using any of those in this article is to explain conceptually *how* they do it and *why* they do it using a VDOM.

### Interact with Another HTML Element
Where are we going to place our new Button? Take another look at the code:

**HTML**
```html
<div id="container"></div>
```
**JavaScript**
```javascript
const fillTemplate = (bpi) => `
  <h1>Bitcoin Price Index</h1>
  <p><strong>USD: </strong>&dollar;${bpi.USD.rate_float}</p>
  ...
  `;

const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
async function fetchData()
// ...

async function renderData() {
  // ...
  const container = document.getElementById('container');
  // ...
  container.innerHTML = filledTemplate;
}
```
If we put it inside `fillTemplate` we won't be able to *attach* an *Event Listener* to it because it would be just a `string` and not an `HTMLElement` instance.

We can put it directly in the HTML document, alongside `div#container` but we'll just making it more complicated by having code outside our current working scope.

A simpler solution is just to work with the button instance in the JavaScript side like this:

```javascript
const fillTemplate = (bpi) => `
  <h1>Bitcoin Price Index</h1>
  <p><strong>USD: </strong>&dollar;${bpi.USD.rate_float}</p>
  ...
  `;

// Handle the toggle-button instance
const toggleButton = () => {
    const btn = document.createElement('button');
    btn.innerText = 'Toggle View';
    btn.addEventListener('click', () => {/* toggle template view */});
    return btn;
};

// ...

async function renderData() {
  // ...
  const container = document.getElementById('container');
  // ...
  container.innerHTML = filledTemplate;
  // Create toggle-button and add it into our document
  const tButton = toggleButton();
  container.append(tButton);
}
```
Our new button doesn't make anything yet and that's okay for the moment. We're going to complete its Event Handler in later steps. For now let's move to the next point in our requirements which is handling a simple state in our app.

### Manage a State in the App
Before you start thinking about Redux and the Vuex Store let me tell you that we don't need to implement that pattern for this example, in fact, a simple object will work excellent as our state because the main reason why we need a state here is to make it easy for our template to **reflect** our application state. At the end, our simple application will work in the following order:

> **Execution Order**
> Create Initial State -> Fetch API Data ->  Render HTML based on State and Data

Stick with me, this is necessary in order to demonstrate why using a Virtual DOM makes rendering HTML Elements faster.

Having said that, let's add the object where we're going to concentrate our state and make sure our button and template *reflect* that state:

```javascript
// Adding Application State
const STATE = {
  fullView: false, // when it's `true` the template should show all prices
};

// Update HTML template to reflect the state
const fillTemplate = (bpi) => {
  const simpleView = `
    <h1>Bitcoin Price Index</h1>
    <p><strong>USD: </strong>&dollar;${bpi.USD.rate_float}</p>`;
  const fullView = simpleView.concat(`
    <p><strong>GBP: </strong>&pound;${bpi.GBP.rate_float}</p>
    <p><strong>EUR: </strong>&euro;${bpi.EUR.rate_float}</p>`);
  return STATE.fullView ? fullView : simpleView;
};

// Update Button to reflect the state
const toggleButton = () => {
  const btn = document.createElement('button');
  btn.innerText = STATE.fullView ? 'Show Less' : 'Show More';
  btn.addEventListener('click', () => {/* toggle template view */});
  return btn;
};

// Fetch Data
const url = '...';
async function fetchData() // ...

// Render Data
async function renderData() // ...
```
Now it looks more structured. As you see the code is divided into 5 parts:
- App State
- Price-View (HTML template or Component)
- Toggle Button
- Data Fetching
- Render Function

Before moving to the next feature requirement, I'm going to make a few changes in our `fillTemplate` function because it doesn't make sense in our new context anymore. It's not a function for *'filling'* some template with data, now it's an independent view or better yet, a component. Therefore our function for rendering bitcoin prices would look like this: 

```javascript
// Bitcoin Prices (HTML Template)
const bitcoinPrices = (bpi) => {
  // ...
  return STATE.fullView ? fullView : simpleView;
};
```

### Decouple Rendering from Data-Fetching
If we don't separate the rendering part from the data-fetching in `renderData()` we will have a performance issue. Let's complete the Event Handler in our button so you can see the issue:

```javascript
const toggleButton = () => {
  const btn = document.createElement('button');
  btn.innerText = STATE.fullView ? 'Show Less' : 'Show More';
  btn.addEventListener('click', () => {
    // Change the state when the user clicks the button
    STATE.fullView = !STATE.fullView;
    // We need to re-render our components in order to reflect the new state
    renderData();
  });
  return btn;
};
```
So far, the only way we have to trigger a new rendering process in our code is by calling `renderData()` which makes an API call (data-fetching) and then makes the actual rendering of our components. For our feature, we don't need to make another API request again, we just need to make our components reflect the new state so let's *decouple* our logic in `renderData()` into a single function `renderComponents()`.

```javascript
function renderComponents() {
  const btcPrices = bitcoinPrices();
  const tButton = toggleButton();
  const appContainer = document.getElementById('container');
  appContainer.innerHTML = btcPrices;
  appContainer.append(tButton);
}
```
With this simplified rendering function we can now execute only the rendering of our components in our Button's Event Handler:

```javascript
const toggleButton = () => {
  //...
  btn.addEventListener('click', () => {
    // ...
    // Trigger just the re-rendering
    renderComponents();
  });
  // ...
};
```

If you run the code we have done so far you will notice that `bitcoinPrices()` will render its markup with undefined values. This is because we didn't provide the data it needs as a parameter so the component doesn't have access to the information regarding Bitcoin's prices. How do we solution this little accessibility problem? One way to solve it is by making the application data accessible to all of our components, similarly to how we did it with the `STATE`. Another thing we need to consider is that after refactoring our rendering function we "lost" our initial function for bootstrapping our app. So let's make the changes needed to solve those two problems:

```javascript
// Application State
const STATE = {
  fullView: false
};

// Application Data
const DATA = {
  bpi: {}
};

// Bitcoin Prices Component
const bitcoinPrices = () => {
  const { USD, GBP, EUR } = DATA.bpi.bpi;
  const simpleView = `
    <h1>Bitcoin Price Index</h1>
    <p><strong>USD: </strong>&dollar;${USD.rate_float}</p>`;
  const fullView = simpleView.concat(`
    <p><strong>GBP: </strong>&pound;${GBP.rate_float}</p>
    <p><strong>EUR: </strong>&euro;${EUR.rate_float}</p>`);
  return STATE.fullView ? fullView : simpleView;
};

// Toggle Button
const toggleButton = () => {
  const btn = document.createElement("button");
  btn.innerText = STATE.fullView ? "Show Less" : "Show More";
  btn.addEventListener("click", () => {
    STATE.fullView = !STATE.fullView;
    renderComponents();
  });
  return btn;
};

// Fetch API Data
async function fetchData() {
  const url = "https://api.coindesk.com/v1/bpi/currentprice.json";
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Render Components
function renderComponents() {
  const btcPrices = bitcoinPrices();
  const tButton = toggleButton();
  const appContainer = document.getElementById("container");
  appContainer.innerHTML = btcPrices;
  appContainer.append(tButton);
}

// Start Application
async function init() {
  DATA.bpi = await fetchData();
  renderComponents();
}

init();

```
> You can see [here the working example](https://codepen.io/cesar-sanchezibr/pen/xxrGLrJ?editors=0010)

> Another way for making the **app data** accessible to all the components could be by adding the information retrieved from the API directly in our STATE object, similarly to the **Store** implementation in [vuex](https://vuex.vuejs.org/). However, I wanted to make it clear in our code that **App State** and **App Data** are two different things.

## Virtual DOM is Cheaper than Real DOM
As simple as this example may seem, it give us the concepts we need to understand what's a Virtual DOM (VDOM) and why it's used in React and Vue. Look at how we're rendering our components:
```javascript
const bitcoinPrices = () => {
  // ...
  const simpleView = `
    <h1>Bitcoin Price Index</h1>
    <p><strong>USD: </strong>&dollar;${USD.rate_float}</p>`;
  const fullView = simpleView.concat(`
    <p><strong>GBP: </strong>&pound;${GBP.rate_float}</p>
    <p><strong>EUR: </strong>&euro;${EUR.rate_float}</p>`);
  //...
};

const toggleButton = () => {
  const btn = document.createElement("button");
  btn.innerText = STATE.fullView ? "Show Less" : "Show More";
  //...
};
```

`bitcoinPrices()` uses a **template**, this means that we can represent HTML elements (`h1`, `p`, `strong`) inside a `string`. Technically, this function only creates a `string`, it doesn't care about how many HTML elements we put inside, for javascript it is just a `string`. On the other side, `toggleButton()` creates an **object instance** of the HTML Element (button) every time we call it. Both of them are functions that depend on the applications's State and Data.

Which one is better? It depends on the requirement, `bitcoinPrices` doesn't need an Event Handler, it just need to render *static* HTML. `toggleButton` not only needs to render an HTML element (a button in our case) but also needs to handle a Click Event which can't be accomplished using just a `string`.

Where is the Virtual DOM in all of this? There is not...yet. Remember that `toggleButton` calls `document.createElement()`? Well, think about the size of the object that `createElement()` instantiates. It's an object with dozens of [properties, methods and events](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement). Just run `document.createElement('button')` in your browser's console and see the result. Our example has just one button but think in real-world applications where there are hundreds of elements (buttons, inputs, images, paragraphs) that need to respond to user actions and changes in the app's state. In addition, every time you call `document.createElement()` you are calling a function outside JavaScript, you're calling the [DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) which costs more time than creating a simple object in JavaScript. Even though modern browsers have done a great effort in making JavaScript to run faster, the current state of JavaScript is not powerful enough to handle all the operations we want to do in our current web applications.

Then, **What is the most efficient way to orchestrate State, Data-Fetching and Rendering?** This is the important question, this is what most front-end libraries try to achieve and **Virtual DOM** is a fundamental part in the strategy to accomplish it. A Virtual DOM is a lightweight representation of the DOM in JavaScript. JavaScript is excellent for manipulating thousands of objects and arrays but not excellent for manipulating thousands of HTML Elements in the DOM.

Coming back to our `toggleButton` you can see that we don't need all those properties and methods that `createElement()` instantiates to represent a DOM Element in your application, in fact we just need a tag name, properties and content.

> It's cheaper to make operations in a virtual DOM representation than with the real DOM.

### Decouple App Logic From Rendering
Another advantage of using a Virtual DOM is that you can separate your application's logic (State, Data, Template Conditions) from the process of *rendering* the *User Interface* which in our example is based on HTML elements using the DOM API in the browser. However, it could be any other rendering API like the one used in Android or iOS. Does React Native sound familiar?

### VDOM Implementation
Now that we clarified what is the **Virtual DOM** and why is it used in popular libraries let's see how to implement it in our example. If you look at our code, you will notice that our components need only three things to work:
- Template (HTML Elements)
- State and Data
- Event Handler

Let's *refactor* our `toggleButton` to make it *rendering agnostic*.
```javascript
/**
Function that generates an object which represents
our Button HTML Element
*/
const toggleButton = () => ({
  tag: 'button',
  content: STATE.fullView ? 'Show Less' : 'Show More',
  event: {
    name: 'click',
    handler: () => {
      STATE.fullView = !STATE.fullView;
      renderComponents();
    };
  }
});
```

Since we moved away the rendering part in `toggleButton` now we need a proper *rendering* function which will create the actual DOM Elements in our application.

```javascript
// Render function
function render(component, parent) {
  const element = document.createElement(component.tag);
  element.innerHTML = component.content;
  if (component.event) {
    const { name, handler } = component.event;
    element.addEventListener(name, handler);
  }
  parent.append(element);
}
```
> Notice that we need a reference to the component's parent for attaching the new created HTML Element in the DOM. If we skip that part our element would not be rendered in the document (DOM).

> This new `render()` function **is not** a subsitute of `renderComponents()`. We are going to use both at the end.

Now let's apply the same changes to `bitcoinPrices()`.

```javascript
// Bitcoin Prices Component
const bitcoinPrices = () => {
  const { USD, GBP, EUR } = DATA.bpi.bpi;
  const simpleView = `
    <h1>Bitcoin Price Index</h1>
    <p><strong>USD: </strong>&dollar;${USD.rate_float}</p>`;
  const fullView = simpleView.concat(`
    <p><strong>GBP: </strong>&pound;${GBP.rate_float}</p>
    <p><strong>EUR: </strong>&euro;${EUR.rate_float}</p>`);
  return {
    tag: 'div',
    content: STATE.fullView ? fullView : simpleView,
  };
};
```
> Because this component only needs markup we don't need to make many changes, in fact we just updated the `return` statement

The last thing we need to adapt in order to have a working example is our `renderComponents()` function.
```javascript
// Render Components
function renderComponents() {
  // Reference to the root element
  const appContainer = document.getElementById("container");
  // Components that represent our HTML Elements
  const btcPrices = bitcoinPrices();
  const tButton = toggleButton();
  // Render components
  render(btcPrices, appContainer);
  render(tButton, appContainer);
}
```
One thing I need to mention here is that if you run this code you will see every time we call `renderComponents()` the HTML elements are **added** into our root element (`div#container`) without deleting its content. This means that we are going to duplicate our components every time we call `renderComponents()` which is not the expected case. In order to avoid this problem, we're going to *clear* `appContainer` before render our components.

```javascript
function renderComponents() {
  const appContainer = document.getElementById("container");
  appContainer.innerHTML = ""; // Avoid duplication of elements
  //...
}
```
With these latest changes we have covered all the *refactor* needed in order to create Virtual DOM components and successfully orchestrating the different parts on our basic application.

One last thing I want to add just to make the Virtual DOM more clear and more similar to how React and Vue implements it, is an array holding the reference to our components. This is not strictly necessary for our example to work but it would give you a sense of how a VDOM looks in reality.

```javascript
/* List of functions that create our components */
const VDOM = [bitcoinPrices, toggleButton];
//..
// Previously 'renderComponents()'
function renderVDOM() {
  const appContainer = document.getElementById("container");
  appContainer.innerHTML = ""; // Avoid duplication of elements
  // Render each component into our real DOM
  VDOM.forEach(createComponent => {
    const component = createComponent();
    render(component, appContainer);
  });
}
```
> Notice that the function `renderComponents()` was renamed to `renderVDOM()`

Excellent! We have covered the *what*, *why* and *how* on VDOM 🚀


## Alternatives to VDOM?
I think that using the strategy of modern front-end libraries for DOM manipulation is useful just because of the low performance that JavaScript has at doing the job.
> If making operations directly with the DOM API were faster, implementing a VDOM would not be necessary.

Do you think that there's a better alternative to the Virtual DOM?
 