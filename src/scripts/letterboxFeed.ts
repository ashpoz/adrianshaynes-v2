export {};

const letterboxRssFeed = `http://localhost:8888/api/letterbox`;
const response = await fetch(letterboxRssFeed);
const data = await response.json();

console.log(data);
