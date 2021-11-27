const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});

const indexRestaurantsToElastic = async (body) => {
  const dataset = body.flatMap((doc) => [
    { index: { _index: "restaurants" } },
    doc,
  ]);
  const { body: bulkResponse } = await client.bulk({
    refresh: true,
    body: dataset,
  });

  return bulkResponse;
};

const searchRestaurants = async (q) => {
  const { body } = await client.search({
    index: "restaurants",
    body: {
      query: {
        query_string: {
          query: q + "*",
          fields: ["name" /*"cuisine"*/],
        },
      },
    },
  });

  const hits = body.hits.hits;

  const result = hits.map((hit) => {
    return {
      id: hit._id,
      name: hit._source.name,
      cuisine: hit._source.cuisine,
    };
  });

  return result;
};

const initElastic = async () => {
  try {
    const ping = await client.ping();

    console.log("Connected to elastic successfully");
  } catch (e) {
    throw e;
  }
};

module.exports = { initElastic, indexRestaurantsToElastic, searchRestaurants };
