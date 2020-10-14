"use strict";

/**
 * location-input.js controller
 *
 * @description: A set of functions called "actions" of the `location-input` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.
    console.log(ctx);
    // Send 200 `ok`
    ctx.send({
      message: "ok",
    });
  },
};
