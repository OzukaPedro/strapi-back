const { createCoreController: createPessoaFisicaController } =
  require("@strapi/strapi").factories;

module.exports = createPessoaFisicaController(
  "api::cadastro-pessoa-fisica.cadastro-pessoa-fisica",
  ({ strapi }) => ({
    async find(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: { cadastro: true },
      };

      return await super.find(ctx);
    },
  })
);
