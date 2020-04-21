const express = require("express");
const cors = require("cors");
const {uuid} = require("uuidv4")


const app = express();

app.use(express.json());
app.use(cors());


function validate(request, response, next){
	const {title, url, techs} = request.body;
	
	if(!title || !url || !techs){
		return response.status(400).json({error: "Missing info."});
	}
	
	return next();
}


const repositories = [];

app.get("/repositories", (request, response) => {
	response.json(repositories)
});

app.post("/repositories", validate, (request, response) => {
	const {title, url, techs} = request.body;

	const repository = { id : uuid(), title, url, techs, likes : 0};

	repositories.push(repository);

	response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
	const {id} = request.params;
	const {title, url, techs} = request.body;

	const repositoryIndex = repositories.findIndex(repository => repository.id === id);

	if (repositoryIndex < 0) {
		return response.status(400).json({error: "Repository not found"})
	}

	const old_repository = repositories[repositoryIndex]

	repository = {
		id,
		title : title  ? title : old_repository.title,
		url : url ? url : old_repository.url,
		techs : techs ? techs : old_repository.techs,
		likes: old_repository.likes
	}
	repositories[repositoryIndex] = repository

	return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
	const {id} = request.params;

	const repositoryIndex = repositories.findIndex(repository => repository.id === id);

	if (repositoryIndex < 0) {
		return response.status(400).json({error: "Repository not found"})
	}

	repositories.splice(repositoryIndex, 1);

	return response.status(204).json({})
});

app.post("/repositories/:id/like", (request, response) => {
	const {id} = request.params;

	const repositoryIndex = repositories.findIndex(repository => repository.id === id);

	if (repositoryIndex < 0) {
		return response.status(400).json({error: "Repository not found"})
	}

	const repository = repositories[repositoryIndex];

	repository.likes++;

	repositories[repositoryIndex] = repository;

	return response.json(repository)

});

module.exports = app;
