export {};

const letterboxRssFeed = `https://letterboxd.com/ashpoz/rss/`;
const data = await fetch(letterboxRssFeed);
const response = await data.text();
const xml = new window.DOMParser().parseFromString(response, "text/xml");

console.log(xml);
