const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
    sanitizeEntity(user, {
        model: strapi.query('user', 'users-permissions').model,
    });
module.exports = {
    /**
  * Retrieve authenticated user.¨
  * Add --- Return completed data of the user.
  * @return {Object|Array}
  */
    async me(ctx) {
        const user = ctx.state.user;
        let id = ctx.state.user.id;
        if (!user) {
            return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
        }

        let data = await strapi.plugins['users-permissions'].services.user.fetch({
            id,
        });
        
        if (data) {
            data = sanitizeUser(data);
        }
        //const data = sanitizeUser(user);
        ctx.send(data);
    },
}