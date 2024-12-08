/**
 * viagem controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::viagem.viagem",
  ({ strapi }) => ({
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
  })
);
