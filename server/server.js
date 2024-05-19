const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
const cors = require('cors');

const app = express();

// Set views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const URI = 'bolt://34.232.57.230:7687';
const USER = 'neo4j';
const PASSWORD = 'internship-2024';

// Establish Neo4j driver
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

driver.onError = (err) => {
  console.error(`Connection error: ${err}`);
};

app.get('/recipes', async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (author:Author)-[:WROTE]->(recipe:Recipe)
      OPTIONAL MATCH (recipe)-[:CONTAINS_INGREDIENT]->(ingredient:Ingredient)
      OPTIONAL MATCH (recipe)-[:COLLECTION]->(collection:Collection)
      OPTIONAL MATCH (recipe)-[:KEYWORD]->(Keyword:Keyword)
      OPTIONAL MATCH (recipe)-[:DIET_TYPE]->(DietType:DietType)
      WITH author, recipe, COLLECT(DISTINCT ingredient.name) AS ingredients, COUNT(DISTINCT ingredient) AS numIngredients, 
        recipe.skillLevel AS recipeSkillLevel, 
        COLLECT(DISTINCT collection.name) AS collections, 
        COLLECT(DISTINCT Keyword.name) AS keywords, 
        COLLECT(DISTINCT DietType.name) AS DietTypes
      RETURN author.name AS author, recipe.name AS name, recipe.description AS description, 
        recipe.cookingTime AS cookingTime, recipe.preparationTime AS preparationTime, 
        ingredients, numIngredients, recipeSkillLevel, collections, keywords, DietTypes
      ORDER BY name ASC
    `);

    const recipes = result.records.map(record => ({
      author: record.get('author'),
      name: record.get('name'),
      description: record.get('description'),
      cookingTime: record.get('cookingTime')?.low || 0,
      preparationTime: record.get('preparationTime')?.low || 0,
      ingredients: record.get('ingredients').join(', '),
      numIngredients: record.get('numIngredients').low,
      recipeSkillLevel: record.get('recipeSkillLevel'),
      collections: record.get('collections').join(', '),
      keywords: record.get('keywords').join(', '),
      DietTypes: record.get('DietTypes').join(', ')
    }));

    console.log('Fetched recipes:', recipes);
    res.json({ recipes });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).send('Internal Server Error');
  } finally {
    await session.close();
  }
});

app.get('/', (req, res) => {
  res.send('Express server is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await driver.close();
  console.log('Neo4j driver closed.');
  process.exit(0);
});
