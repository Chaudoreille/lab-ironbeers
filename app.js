const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res) => {
  punkAPI
  .getBeers()
  .then(beersFromApi => {
    res.locals.beers = []
    beersFromApi.forEach(element => {
      res.locals.beers.push({
        id: element.id,
        image_url: element.image_url,
        name: element.name,
        description: element.description,
        tagline: element.tagline,
      })
    });
    res.render("beers")
  })
  .catch(error => {
    res.statusCode = 500
    res.render("error", {code:500})
  });
})

app.get("/beer-:id", (req, res) => {
  punkAPI
  .getBeer(req.params.id)
  .then(responseFromAPI => {
    res.locals.beer = responseFromAPI[0]
    res.render("random-beer")
  })
  .catch(error => {
    res.statusCode = 500
    res.render("error", {code:500})
  });
})

app.get('/random-beer', (req, res) => {
  punkAPI
  .getRandom()
  .then(responseFromAPI => {
    res.locals.beer = responseFromAPI[0]
    res.render("random-beer")
  })
  .catch(error => {
    res.statusCode = 500
    res.render("error", {code:500})
  });
})

app.listen(3000, () => console.log('🏃‍ on port 3000'));
