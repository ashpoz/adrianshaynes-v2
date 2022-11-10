import type { Handler } from "@netlify/functions";
const axios = require("axios");
const xml2js = require("xml2js");

const handler: Handler = async (event, context) => {
  const config = {
    method: "get",
    url: "https://letterboxd.com/ashpoz/rss/",
  };

  const data = axios(config)
    .then(function (response: { data: XMLDocument }) {
      return response.data;
    })
    .catch(function (error: Error) {
      return error;
    });

  const json = xml2js.parseString(data, (err, result) => {
    if (err) {
      throw err;
    }

    console.log(data);

    // `result` is a JavaScript object
    // convert it to a JSON string
    const json = JSON.stringify(result, null, 4);

    // log JSON string
    console.log(json);
  });

  console.log(await json);

  return {
    statusCode: 200,
    body: await data,
  };
};

export { handler };
