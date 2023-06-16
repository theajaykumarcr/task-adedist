var express = require("express");
var cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

var bodyParser = require("body-parser");

const CLIENT_ID = "af08be84cb68c598a251";
const CLIENT_SECRET = "e57535b3a9bb1990a6529aca53417d7b5efe7be4";

var app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/getAccessToken", async function (req, res) {
  const params =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    req.query.code;
  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data, "test");
      res.json(data);
    })
    .catch((error) => {
      console.error("Access token retrieval failed:", error);
      res.status(500).json({ error: "Access token retrieval failed" });
    });
});

app.get("/getUserData", async function (req, res) {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: authorizationHeader,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("User data retrieval failed");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.error("User data retrieval failed:", error);
      res.status(500).json({ error: "User data retrieval failed" });
    });
});

app.listen(4000, function () {
  console.log("CORS server running on port 4000");
});
