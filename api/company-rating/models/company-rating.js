const slugify = require("slugify");
const algoliasearch = require("algoliasearch");

module.exports = {
  /**
   * Triggered after user create, update or delete rating for company.
   */

  lifecycles: {
    async afterCreate(data) {},
    async afterUpdate(params, data) {},
    async beforeDelete(params) {},
    async afterDelete(params) {},
  },
};
