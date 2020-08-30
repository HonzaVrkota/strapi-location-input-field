"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const algoliasearch = require("algoliasearch");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  update_algolia: async (ctx) => {
    console.log("controller update");
    let entities = await strapi
      .query("company")
      .find({ companyReady: true, companyChecked: true });
    if (entities[0]) {
      const client = algoliasearch(
        "89KJ03GDQ8",
        "55a474ecb5746dacfe93b14d29b2e893"
      );
      let algoliaEntities = [];
      entities.forEach((entity) => {
        console.log(entity.id);
        algoliaEntities.push(
          strapi.services.company.algoliaCustom(entity, "geoloc", "_geoloc")
        );
      });
      console.log(algoliaEntities);
      const index = client.initIndex("dev_BaryZive");
      //console.log(entities[0]);
      //console.log(test);
      await index
        .saveObjects(algoliaEntities)
        .then(({ objectIDs }) => {
        })
        .catch((errAlgo) => {
          console.log(errAlgo);
          return ctx.response.badRequest("Algolia API error");
        });
    } else {
      return ctx.response.badRequest("Missing data");
    }
    return { statusCode: 200, message: "Algolia update success" };
  },
};
