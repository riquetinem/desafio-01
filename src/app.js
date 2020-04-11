const express = require("express");
const { uuid, isUuid } = require('uuidv4');
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId (request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({message: "Id invalido"});
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
   const { title, url, techs } = request.body;

   const repository = {id: uuid(), title, url, techs, likes: 0};

   repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {  
   const { id } = request.params;

   const repositoryId = repositories.findIndex(repository => repository.id === id);

   if (repositoryId < 0) {
    return response.status(400).json({message: "Repositorio nao foi encontrado"})
   }

   const { title, url, techs } = request.body;
   const repository = {id, title, url, techs, likes: repositories[repositoryId].likes};   
   repositories[repositoryId] = repository;

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if (repositoryId < 0) {
    return response.status(400).json({message: "Repositorio nao foi encontrado"})
   }

  repositories.splice(repositoryId, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if (repositoryId < 0) {
    return response.status(400).json({message: "Repositorio nao foi encontrado"})
  }
  
  const repository = repositories[repositoryId] = {
    ...repositories[repositoryId],
    likes: repositories[repositoryId].likes + 1,
  }

  return response.json(repository);
});

module.exports = app;
