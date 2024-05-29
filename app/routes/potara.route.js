const controller = require("../controllers/potara.controller");

module.exports = function (app, web_public_url) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/potara/post", (req, res) => controller.post(req, res, web_public_url));
  app.get("/api/potara/view/overide", (req, res) => controller.view(req, res));    ///api/view?type=svg&id=
};
