import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::modelo.modelo', ({ strapi }) => ({
  // Obter todos os modelos
  async find(ctx) {
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::modelo.modelo', {
      ...query,
      populate: ['usuario', 'contratoes'], // Popule as relações necessárias
    });

    return this.transformResponse(entities);
  },

  // Obter um único modelo pelo ID
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.findOne('api::modelo.modelo', id, {
      populate: ['usuario', 'contratoes'], // Popule as relações necessárias
    });

    if (!entity) {
      return ctx.notFound('Modelo não encontrado');
    }

    return this.transformResponse(entity);
  },

  // Criar um novo modelo
  async create(ctx) {
    const { data } = ctx.request.body;

    if (!data.nomeModelo || !data.prologo || !data.paragrafoUnico) {
      return ctx.badRequest('Os campos nomeModelo, prologo e paragrafoUnico são obrigatórios.');
    }

    const entity = await strapi.entityService.create('api::modelo.modelo', {
      data,
    });

    return this.transformResponse(entity);
  },

  // Atualizar um modelo existente
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data) {
      return ctx.badRequest('Dados para atualização não fornecidos.');
    }

    const entity = await strapi.entityService.update('api::modelo.modelo', id, {
      data,
    });

    if (!entity) {
      return ctx.notFound('Modelo não encontrado para atualização.');
    }

    return this.transformResponse(entity);
  },

  // Deletar um modelo pelo ID
  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.delete('api::modelo.modelo', id);

    if (!entity) {
      return ctx.notFound('Modelo não encontrado para exclusão.');
    }

    return this.transformResponse(entity);
  },

  // Função personalizada: Obter modelos criados por um usuário específico
  async findByUser(ctx) {
    const { userId } = ctx.params;

    const entities = await strapi.entityService.findMany('api::modelo.modelo', {
      filters: { usuario: userId },
      populate: ['usuario', 'contratoes'],
    });

    return this.transformResponse(entities);
  },
}));
