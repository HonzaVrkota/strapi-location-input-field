const slugify = require("slugify");
const algoliasearch = require("algoliasearch");

module.exports = {
  /**
   * Triggered before user creation.
   */

  lifecycles: {
    async beforeCreate(data) {
      /*
      if (data.id) {
        data.objectID = data.id;
      }
      */
      console.log(data);

      if (data.name) {
        data.slug = slugify(data.name, { lower: true });
      }
    },
    async beforeUpdate(params, data) {
      if (data.companyChecked === true) {
      }
      if (data.name) {
        data.slug = slugify(data.name, { lower: true });
      }
      if (data.companyChecked === true && data.companyReady === true) {
        const client = algoliasearch(
          process.env.ALGOLIA_APP_ID,
          process.env.ALGOLIA_ADMIN_API_KEY
        );
        let algoliaEntity = strapi.services.company.algoliaCustom(
          data,
          "geoloc",
          "_geoloc"
        );

        await client
          .multipleBatch([
            {
              action: "updateObject",
              indexName: "dev_BaryZive",
              body: {
                ...algoliaEntity,
              },
            },
          ])
          .then((objectIDs) => {
            console.log("algolia: ", objectIDs);
          })
          .catch((errAlgo) => {
            throw new Error("Algolia Error");
          });
      }
    },
    async beforeDelete(params) {
      console.log("after delete company: ", params);
      const data = await strapi.query("company").find({ id: params.id });
      console.log(data);
      console.log(data[0].objectID);
      if (data[0].objectID) {
        const client = algoliasearch(
          process.env.ALGOLIA_APP_ID,
          process.env.ALGOLIA_ADMIN_API_KEY
        );
        await client
          .multipleBatch([
            {
              action: "deleteObject",
              indexName: "dev_BaryZive",
              body: {
                objectID: data[0].objectID,
              },
            },
          ])
          .then((objectIDs) => {
            console.log("this was delete from algolia: ", objectIDs);
          })
          .catch((errAlgo) => {
            throw new Error("Algolia Error");
          });
      }
    },
  },
};
