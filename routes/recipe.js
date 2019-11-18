const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/cloudinary");

const Recipe = require("../models/Recipe");

router.get("/create", (req, res) => {
  res.render("recipe/recipe-form");
});

router.post("/update", uploadCloud.single("imagePath"), (req, res) => {
  if (!req.body.title) {
    res.render("recipe/recipe-form", { message: "Recipe name can't be empty" });
    return;
  }
  if (!req.body.name) {
    res.render("recipe/recipe-form", {
      message: "Ingredient name can't be empty"
    });
    return;
  }

  const defaultRecipeImage =
    "http://res.cloudinary.com/jeffmoraes/image/upload/v1574087425/images/unknown-plate.png.png";
  let imagePath = req.file ? req.file.url : defaultRecipeImage;

  let ingredients = [];

  if (typeof req.body.name === "string") {
    let obj = { name: req.body.name, qty: req.body.qty, unit: req.body.unit };
    ingredients.push(obj);
  } else {
    req.body.name.forEach((element, index) => {
      let obj = {
        name: element,
        qty: req.body.qty[index],
        unit: req.body.unit[index]
      };
      ingredients.push(obj);
    });
  }

  let method = req.body.method.split("\n");

  Recipe.create({
    title: req.body.title,
    ingredients,
    dishType: req.body.dishType,
    preparationTime: req.body.preparationTime,
    method,
    portions: req.body.portions,
    source: req.body.source,
    image: imagePath
  })
    .then(() => {
      res.send(req.body);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
