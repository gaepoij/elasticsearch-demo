const {
  initElastic,
  indexRestaurantsToElastic,
  searchRestaurants,
} = require("./elastic.js");
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json({ limit: "100mb" }));

app.post("/restaurant", async (req, res) => {
  const { restaurants } = req.body;
  const body = restaurants.map((restaurant) => ({
    cuisine: restaurant.cuisine.split(","),
    name: restaurant.name,
  }));

  await indexRestaurantsToElastic(body);
  res.status(204).send();
});

app.get("/restaurant/search", async (req, res) => {
  const { query } = req.query;
  res.send(await searchRestaurants(query));
});

const main = async () => {
  await initElastic();
};

app.listen(port, async () => {
  await main();
  console.log(`Example app listening at http://localhost:${port}`);
});
