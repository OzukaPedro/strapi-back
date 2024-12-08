const { createCoreController: createPessoaJuridicaController } =
  require("@strapi/strapi").factories;

module.exports = createPessoaJuridicaController(
  "api::cadastro-pessoa-juridica.cadastro-pessoa-juridica",
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
