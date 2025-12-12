
1) 	1 hours 
	- plan for finishing the project
	- what type of data it will have; what niche etc.
	- plan what tables and the relatiosn between them
	- plan for the routes of the project.

	results:
		- five initial tables, 3 main and 2 junctional: 
			- movies: name, year, image
				- the image is prolly going to be just a url or basically hashed name and images will be stored in a static folder and retrieved with that name 
			- actors: name, and whatever else needed 
			- genres: name, and whatever else but not really
			- movies_actors: movie_id, actor_id
			- movies_genres: movie_id, genre_id
		- several routes: 
			- / GET for boring empty home page
			- /movies/:id for viewing, updating, deletion
				- GET, POST, PUT, DELETE
			- /movies GET for all movies page
			- /genre/:name for viewing, updating, and deleting genres as well as adding them; actually it doens't make any sense to allow for the editing of the gneres because we already got the genres as part of the movie submission but we can allow for reading and showing movies of a specific genre or a mixture.
				- GET, PUT, DELETE, POST
   			- what would make sense however is adding something like watched, to-watch, etc. but that would be like a to-do list application and i am not gonna make any more. so this is gonna just have /genre and /genre/:id and maybe /genres which can display a mixture of movies
   				- /genre -> display all the genres that are clickable and go to /genre/:id which then display movies in that genre

	
		- making things pretty later on can be done with either just ejs and css and staying fully ssr
		- or i can refactor and integrate react and refactor apis and remove ejs and abandon the project alltogether
		- cost: 1h3mins

3) 	2 hours
	- make a boiler plate of the express app with routes
	- connect it to data base and populate the db with the script
	- make idempotent views
	- make non-idempotent views and connect them to controllers as well as the queries needed


4)	2 hours
	- if ejs was used and was not styled then remove ejs and use a seperate front shipped and just calls backend for data
	- make it pretty with react on the front end.
	- add the pseudo-auth with admin username and password for destructive actions of mass updates and deletions.
