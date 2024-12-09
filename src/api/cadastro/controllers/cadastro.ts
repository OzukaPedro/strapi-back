/**
 * viagem controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::cadastro.cadastro",
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
      const cadastroData = {
        ...data,
        user: userId, // Relaciona a viagem ao usuário logado
      };

      // Criação da entidade
      const createdEntity = await strapi.entityService.create(
        "api::cadastro.cadastro",
        {
          data: cadastroData,
        }
      );

      const sanitizedEntity = await this.sanitizeOutput(createdEntity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
    async findOne(ctx) {
      try {
        const { id } = ctx.params; // Obtém o ID da URL da requisição

        // Realiza a busca diretamente pela ID
        const entity = await strapi.db.query("api::cadastro.cadastro").findOne({
          where: { id }, // Filtra pelo ID
        });

        // Caso o cadastro não seja encontrado
        if (!entity) {
          return ctx.notFound("Cadastro não encontrado!");
        }

        // Retorna o cadastro encontrado
        return entity;
      } catch (error) {
        console.error("Erro ao buscar cadastro:", error);
        return ctx.internalServerError("Erro ao buscar cadastro.");
      }
    },
    async delete(ctx) {
      try {
        const { id } = ctx.params; // Obtém o ID da URL da requisição

        // Verifica se o cadastro existe antes de tentar deletar
        const entity = await strapi.db.query("api::cadastro.cadastro").findOne({
          where: { id }, // Filtra pelo ID
        });

        // Caso o cadastro não seja encontrado
        if (!entity) {
          return ctx.notFound("Cadastro não encontrado!");
        }

        // Realiza a exclusão do cadastro
        await strapi.db.query("api::cadastro.cadastro").delete({
          where: { id }, // Filtra pelo ID
        });

        // Retorna uma resposta indicando sucesso
        return ctx.send({ message: "Cadastro deletado com sucesso!" });
      } catch (error) {
        console.error("Erro ao deletar cadastro:", error);
        return ctx.internalServerError("Erro ao deletar cadastro.");
      }
    },
    async update(ctx) {
      try {
        const { id } = ctx.params; // Obtém o ID da URL da requisição
        const {
          nome,
          cpf,
          rg,
          cep,
          logradouro,
          numero,
          bairro,
          cidade,
          uf,
          cnpj,
          razaoSocial,
          inscricaoEstadual,
        } = ctx.request.body; // Obtém os dados enviados para atualizar

        // Verifica se o ID foi passado
        if (!id) {
          return ctx.badRequest("ID do cadastro não fornecido.");
        }

        // Verifica se o cadastro existe
        const existingCadastro = await strapi.db
          .query("api::cadastro.cadastro")
          .findOne({
            where: { id },
          });

        if (!existingCadastro) {
          return ctx.notFound("Cadastro não encontrado!");
        }

        // Atualiza o cadastro
        const updatedCadastro = await strapi.db
          .query("api::cadastro.cadastro")
          .update({
            where: { id },
            data: {
              nome,
              cpf,
              rg,
              cep,
              logradouro,
              numero,
              bairro,
              cidade,
              uf,
              razaoSocial,
              inscricaoEstadual,
              cnpj,
            },
          });

        // Retorna o cadastro atualizado
        return ctx.send({
          message: "Cadastro atualizado com sucesso!",
          updatedCadastro,
        });
      } catch (error) {
        console.error("Erro ao atualizar cadastro:", error);
        return ctx.internalServerError("Erro ao atualizar cadastro.");
      }
    },
  })
);
