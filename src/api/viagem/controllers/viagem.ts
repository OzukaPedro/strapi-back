import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::viagem.viagem",
  ({ strapi }) => ({
    // Criar uma nova viagem associada ao usuário autenticado
    async create(ctx) {
      const { id: userId } = ctx.state.user; // Obtém o ID do usuário logado

      if (!userId) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const { data } = ctx.request.body;

      if (!data) {
        return ctx.badRequest("Missing 'data' payload in the request body.");
      }

      // Adiciona o usuário logado ao payload
      const viagemData = {
        ...data,
        user: userId, // Relaciona a viagem ao usuário logado
      };

      // Criação da entidade
      const createdEntity = await strapi.entityService.create(
        "api::viagem.viagem",
        {
          data: viagemData,
        }
      );

      const sanitizedEntity = await this.sanitizeOutput(createdEntity, ctx);
      return this.transformResponse(sanitizedEntity);
    },

    // Obter todas as viagens
    async find(ctx) {
      const { query } = ctx;

      const entities = await strapi.entityService.findMany("api::viagem.viagem", {
        ...query
      });

      return this.transformResponse(entities);
    },

    // Obter uma única viagem pelo ID
    async findOne(ctx) {
      const { id } = ctx.params;

      const entity = await strapi.entityService.findOne("api::viagem.viagem", id);

      if (!entity) {
        return ctx.notFound("Viagem não encontrada.");
      }

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },

    // Atualizar uma viagem existente (somente pelo proprietário)
    async update(ctx) {
      const { id } = ctx.params;
      const { id: userId } = ctx.state.user;
      const { data } = ctx.request.body;

      if (!userId) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const existingEntity = await strapi.entityService.findOne(
        "api::viagem.viagem",
        id
      );

      if (!existingEntity) {
        return ctx.notFound("Viagem não encontrada.");
      }

      const updatedEntity = await strapi.entityService.update(
        "api::viagem.viagem",
        id,
        { data }
      );

      const sanitizedEntity = await this.sanitizeOutput(updatedEntity, ctx);
      return this.transformResponse(sanitizedEntity);
    },

    // Deletar uma viagem (somente pelo proprietário)
    async delete(ctx) {
      const { id } = ctx.params;
      const { id: userId } = ctx.state.user;

      if (!userId) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const existingEntity = await strapi.entityService.findOne(
        "api::viagem.viagem",
        id
      );

      if (!existingEntity) {
        return ctx.notFound("Viagem não encontrada.");
      }

      await strapi.entityService.delete("api::viagem.viagem", id);
      return ctx.send({ message: "Viagem excluída com sucesso." });
    },

    // Obter viagens associadas ao usuário autenticado
    async findByUser(ctx) {
      const { id: userId } = ctx.state.user;

      if (!userId) {
        return ctx.unauthorized("Usuário não autenticado.");
      }

      const entities = await strapi.entityService.findMany("api::viagem.viagem", {
        filters: { user: userId },
        populate: ["user", "contratoes"],
      });

      return this.transformResponse(entities);
    },
  })
);
