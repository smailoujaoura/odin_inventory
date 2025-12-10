const express = require('express');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
// const favicon = require('serve-favicon');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // i don't really know why this works but sending a file works just fine
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

const mainRouter = require('./routes/main');
const productsRouter = require('./routes/movies');
const genresRouter = require('./routes/genres');
app.use("/", mainRouter);
app.use("/movies", productsRouter);
app.use("/genres", genresRouter);

app.listen(process.env.PORT || 3000, (err) => {
	if (err)
		throw err;
	console.log(`listening on PORT: ${process.env.PORT || 3000}`);
})