export {};

const letterboxRssFeed = `http://localhost:8888/.netlify/functions/letterbox`;
const data = await fetch(letterboxRssFeed);
const response = await data.text();
const xml = new window.DOMParser().parseFromString(response, "text/xml");
const items = xml.querySelectorAll("item");

console.log(items);
