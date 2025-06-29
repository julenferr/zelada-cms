'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::trabajo.trabajo', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.findOne('api::trabajo.trabajo', id, {
      populate: ['imagenes', 'portada', 'categorias'],
    });

    if (!entity) {
      return ctx.notFound('Trabajo no encontrado');
    }

    return { data: entity };
  },
}));
