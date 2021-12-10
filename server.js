require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const axios = require('axios');
const methodOverride = require('method-override');


const { Favorite, Park, State, Trail, User } = require('./models');
//console.log(Park);
const SECRET_SESSION = process.env.SECRET_SESSION;
console.log(SECRET_SESSION);

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('index');
})

// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get();
  res.render('profile', { id, name, email });
});

// controllers
app.use('/auth', require('./controllers/auth'));



app.get('/', function (req, res) {
  res.json({ message: 'Welcome to national parks' });
});

//////////////// CREATE PARKS  ///////////////////////////////

axios.get('https://developer.nps.gov/api/v1/parks?limit=465&api_key=p9r2e6uOfh6OhiCQXIFY2zUhzRfYrgJRULsesOCT')
  .then(response => {
    // console.log('DATA HERE', Object.keys(response.data));
    console.log('DATA HERE');

    let array = response.data.data;
    for (let i = 0; i < array.length; i++) {
      let park = array[i];
      console.log(park.fullName);               // name
      console.log(park.description);            // about
      console.log(park.weatherInfo);            // weatherInfo
      console.log(park.states);                 //state
      console.log(park.addresses[1].city);      //city 
      console.log(park.images[0].url);          //img
      console.log('........');


      Park.create({
        name: park.fullName,
        about: park.description,
        city: park.addresses[1].city,
        state: park.states,
        weatherInfo: park.weatherInfo,
        img: park.images[0].url

      })
        .then(function (newParks) {
          console.log('NEW PARKS CREATED', newParks.toJSON());
        })
        .catch(function (error) {
          console.log('ERROR', error)
        });
    }
  })
  .catch(err => {
    console.log(err);
  });

////////////////////////////////////////////////////////////////




/////////////////   GET PARKS  /////////////////////


app.get('/parks', function (req, res) {
  Park.findAll()
    .then(function (parksList) {
      console.log('FOUND ALL PARKS', parksList);
      res.render('parks', { parks: parksList });
    })
    .catch(function (error) {
      console.log('ERROR', error);
      res.json({ msg: 'Error occured' });
    });
});


app.get('/parks/:id', function (req, res) {
  console.log('PARAMS', req.params);
  let parkIndex = Number(req.params.id);
  console.log('NUMBER?', parkIndex);
  Park.findByPk(parkIndex)
    .then(function (park) {
      if (park) {
        park = park.toJSON();
        console.log('IS IT NUMBER?', park);
      } else {
        console.log('Sorry... try it again')
        res.render('/show', { park: park });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    })

})

////////////////////////////////////////////////////


////////////// POST ////////////

app.post('/favorites', function (req, res) {
  console.log('FORM', req.body);

  Favorite.create({

  })



})














const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;













