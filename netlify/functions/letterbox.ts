import type { Handler } from "@netlify/functions";

var axios = require("axios");

const handler: Handler = async (event, context) => {
  var config = {
    method: "get",
    url: "https://letterboxd.com/ashpoz/rss/",
    headers: {
      Cookie: "com.xk72.webparts.csrf=678f117b46563559b420",
    },
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

  return event;
};

export { handler };
