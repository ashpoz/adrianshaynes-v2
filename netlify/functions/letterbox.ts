import type { Handler } from "@netlify/functions";
const axios = require("axios");
const xml2js = require("xml2js");

const handler: Handler = async (event, context): Promise<any> => {
  const config = {
    method: "get",
    url: "https://letterboxd.com/ashpoz/rss/",
  };

  const data = await axios(config)
    .then(function (response: { data: XMLDocument }) {
      return response.data;
    })
    .catch(function (error: Error) {
      return error;
    });

  let json = {};

  xml2js.parseString(data, function (err: Error, result: Object) {
    if (err) {
      throw Error;
    }
    json = result;
  });

  json = JSON.stringify(json, null, 4);

  return {
    statusCode: 200,
    body: json,
  };
};

export { handler };
