"use strict";
const algoliasearch = require("algoliasearch");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
   * Promise to edit record
   *
   * @return {Promise}
   */

  algoliaCustom: (object, key, newKey) => {
    const clone = (obj) => Object.assign({}, obj);

    const clonedObj = clone(object);

    const targetKey = clonedObj[key];
    delete clonedObj[key];

    clonedObj[newKey] = targetKey;
    return clonedObj;
  },
  async update(params, data, { files } = {}) {
    const entry = await strapi.query("company").update(params, data);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: "company",
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }
    //console.log(entry);

    if (entry.companyChecked === true && entry.companyReady === true) {
      // const client = algoliasearch(
      //   "89KJ03GDQ8",
      //   "55a474ecb5746dacfe93b14d29b2e893"
      // );
      console.log("now shloud be algolia");
      const client = algoliasearch(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_ADMIN_API_KEY
      );
      let editEntry = this.algoliaCustom(entry, "geoloc", "_geoloc");
      console.log("NEws", editEntry);
      await client
        .multipleBatch([
          {
            action: "updateObject",
            indexName: "dev_BaryZive",
            body: {
              ...editEntry,
            },
          },
        ])
        .then((objectIDs) => {
          console.log(objectIDs);
        })
        .catch((errAlgo) => {
          throw new Error("Algolia Error");
        });
    }
    return entry;
  },
};
