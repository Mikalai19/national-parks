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
const { Op } = require('sequelize');


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

////////////// CREATE PARKS  ///////////////////////////////

// axios.get('https://developer.nps.gov/api/v1/parks?limit=465&api_key=p9r2e6uOfh6OhiCQXIFY2zUhzRfYrgJRULsesOCT')
//   .then(response => {
//     // console.log('DATA HERE', Object.keys(response.data));
//     console.log('DATA HERE');

//     let array = response.data.data;
//     for (let i = 0; i < array.length; i++) {
//       let park = array[i];
//       console.log(park.fullName);               // name
//       console.log(park.description);            // about
//       console.log(park.weatherInfo);            // weatherInfo
//       console.log(park.states);                 //state
//       console.log(park.addresses[1].city);      //city 
//       console.log(park.images[0].url);          //img
//       console.log('........');


//       Park.create({
//         name: park.fullName,
//         about: park.description,
//         city: park.addresses[1].city,
//         state: park.states,
//         weatherInfo: park.weatherInfo,
//         img: park.images[0].url

//       })
//         .then(function (newParks) {
//           console.log('NEW PARKS CREATED', newParks.toJSON());
//         })
//         .catch(function (error) {
//           console.log('ERROR', error)
//         });
//     }
//   })
//   .catch(err => {
//     console.log(err);
//   });


// // Park.findAll({
// //   where: { name: 'National Park' }
// // })
// //   .then(function (parkFind) {
// //     console.log('PARK', parkFind);
// //   })
// //   .catch(function (error) {
// //     console.log('ERROR', error);
// //   })



////////////////////////////////////////////////////////////////




/////////////////   GET PARKS  /////////////////////


app.get('/parks', function (req, res) {
  Park.findAll({
    where: {
      name: {
        [Op.substring]: 'National Park'
      }
    }
  })
    .then(function (parksList) {
      console.log('FOUND ALL PARKS', parksList);
      res.render('parks', { parks: parksList });
    })
    .catch(function (error) {
      console.log('ERROR', error);
      res.json({ msg: 'Error occured' });
    });
});


app.get('/showall', function (req, res) {
  Park.findAll({
    where: {
      name: {
        [Op.substring]: 'National Park'
      }
    }
  })
    .then(function (parksList) {
      console.log('FOUND ALL PARKS', parksList);
      res.render('showall', { parks: parksList });
    })
    .catch(function (error) {
      console.log('ERROR', error);
      res.json({ msg: 'Error occured' });
    });
});


app.get('/parks/new', function (req, res) {
  res.render('parks/new');
});

app.get('/parks/edit/:id', function (req, res) {
  let parkIndex = Number(req.params.id);
  Park.findByPk(parkIndex)
    .then(function (park) {
      if (park) {
        park = park.toJSON();
        res.render('parks/edit', { park });

      } else {
        console.log('This park does not exist');
        res.render('404', { msg: 'park does not exist' });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    });

})

app.get('/parks/:id', function (req, res) {
  console.log('PARAMS', req.params);
  let parkIndex = Number(req.params.id);
  console.log('NUMBER?', parkIndex);
  Park.findByPk(parkIndex)
    .then(function (park) {
      if (park) {
        park = park.toJSON();
        console.log('IS IT NUMBER?', park);
        res.render('parks/showalldetails', { park: park });
      } else {
        console.log('Sorry...Try it again')
        res.render('404', { msg: 'Sorry...Try it again' });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    })

})


////////////////////////////////////////////////////


app.get('/favorites', function (req, res) {
  Favorite.findAll()
    .then(function (favoritesList) {
      console.log('FOUND ALL favorites', favoritesList);
      res.render('favorites/index', { favorites: favoritesList })
    })
    .catch(function (err) {
      console.log('ERROR', err);
      res.json({ message: 'Error occured, please try again....' });
    });
});





app.get('/favorites', function (req, res) {
  res.render('favorites');
});

app.get('/favorites/edit/:id', function (req, res) {
  let favoriteIndex = Number(req.params.id);
  Favorite.findByPk(favoriteIndex)
    .then(function (favorite) {
      if (favorite) {
        favorite = favorite.toJSON();
        res.render('favorites', { favorite });

      } else {
        console.log('This favorite does not exist');
        res.render('404', { msg: 'favorite does not exist' });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    });

})

app.get('/favorites/:id', function (req, res) {
  console.log('PARAMS', req.params);
  let favoriteIndex = Number(req.params.id);
  console.log('IS THIS A NUMBER?', favoriteIndex);
  Favorite.findByPk(favoriteIndex)
    .then(function (favoritePark) {
      if (favoritePark) {
        favoritePark = favoritePark.toJSON();
        console.log('IS THIS A Park?', favoritePark);
        res.render('favorites/index', { favoritePark });
      } else {
        console.log('This Park does not exist');
        res.render('404', { msg: 'Park does not exist' });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    });
});

app.post('/favorites', function (req, res) {
  console.log('FORM', req.body);
  Favorite.create({
    parkId: req.body.parkId,
  })
    .then(function (newFavorite) {
      newFavorite = newFavorite.toJSON();
      console.log('CREATE A FAVORITE', newFavorite);
      res.redirect(`/favorites/${newFavorite.id}`);
    })
    .catch(function (error) {
      console.log.apply('ERROR', error);
      res.render('404', { msg: 'Sorry... Try it again' });
      // res.redirect('favorites');
    })

});

// app.delete('/favorites/:id', function (req, res) {
//   console.log("ID", req.params.id);
// })
// let favoriteIndex = Number(req.params.id);
// Favorite.destroy({
//   where: { id: favoriteIndex }
// })
//   .then(function (response) {
//     console.log('FAVORITES DELETED', response);
//     res.redirect('/favorites');
//   })
//   .catch(function (err) {
//     console.log(err);
//   })

///////// STATE CREATE /////////////

// State.create({
//   name: 'WA',
//   numberOfParks: 8
// })
//   .then(function (newState) {
//     console.log('STATE NAME', newState);
//   })
//   .catch(function (error) {
//     console.log('ERROR', error);
//   });


//////// TRAILS CREATE ///////

// Trail.create({
//   name: 'Emerald Pools Trail',
//   length: '3,0',
//   difficulty: 'Moderate'
// })
//   .then(function (newTrail) {
//     console.log('PARK NAME', newTrail);
//   })
//   .catch(function (error) {
//     console.log('ERROR', error)
//   })




/////////////////   GET Trails  /////////////////////



app.get('/trails', function (req, res) {
  Trail.findAll()
    .then(function (trailList) {
      console.log('FOUND ALL TRAILS', trailList);
      res.render('trails/index', { trails: trailList })
    })
    .catch(function (err) {
      console.log('ERROR', err);
      res.json({ msg: 'Error , please try again....' });
    });
});




app.get('/trails/new', function (req, res) {
  res.render('trails/new');
});


app.get('/trails/edit/:id', function (req, res) {
  let trailIndex = Number(req.params.id);
  Trail.findByPk(trailIndex)
    .then(function (trail) {
      if (trail) {
        trail = trail.toJSON();
        res.render('trails/edit', { trail });

      } else {
        console.log('This trail does not exist');
        res.render('404', { msg: 'Trail does not exist' });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    });

})


app.get('/trails/:id', function (req, res) {
  console.log('PARAMS', req.params);
  let trailIndex = Number(req.params.id);
  console.log('IS THIS A NUMBER?', trailIndex);
  Trail.findByPk(trailIndex)
    .then(function (trail) {
      if (trail) {
        trail = trail.toJSON();
        console.log('IS THIS A trail?', trail);
        res.render('trails/show', { trail });
      } else {
        console.log('This trail does not exist');
        res.render('404', { msg: 'trail does not exist' });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    });
});


app.post('/trails', function (req, res) {
  console.log('SUBMITTED FORM', req.body);

  Trail.create({
    name: req.body.name,
    length: Number(req.body.length),
    difficulty: Number(req.body.difficulty),

  })
    .then(function (newTrail) {
      console.log('NEW Trail', newTrail.toJSON());
      newTrail = newTrail.toJSON();
      res.redirect(`/trails/${newTrail.id}`);
    })
    .catch(function (error) {
      console.log('ERROR', error);
      res.render('404', { msg: 'Trail was not added' })
      //res.redirect('/trails/new');
    })

});

/////////// UPDATE TRAIL ////////////////

app.put('/trails/:id', function (req, res) {
  console.log('SUBMITTED FORM', req.body);
  let trailIndex = Number(req.params.id);
  Trail.update({
    name: req.body.name,
    length: Number(req.body.length),
    difficulty: req.body.difficulty

  },
    { where: { id: trailIndex } })

    .then(function (response) {
      console.log('UPDATED', response);
      res.redirect(`/new/${trailIndex}`);
    })
    .catch(function (error) {
      console.log('ERROR', error);
      res.render('404', { msg: 'Sorry... Update was not successful' })

    })

});



////////// STATES ///////////////

app.get('/states', function (req, res) {
  State.findAll()
    .then(function (stateList) {
      console.log('FOUND ALL states', stateList);
      res.render('states/index', { states: stateList })
    })
    .catch(function (err) {
      console.log('ERROR', err);
      res.json({ msg: 'Error , please try again....' });
    });
});

app.get('/states/new', function (req, res) {
  res.render('states/new');
});


app.get('/states/:id', function (req, res) {
  console.log('PARAMS', req.params);
  let stateIndex = Number(req.params.id);
  console.log('IS THIS A NUMBER?', stateIndex);
  State.findByPk(stateIndex)
    .then(function (state) {
      if (state) {
        state = state.toJSON();
        console.log('IS THIS A state?', state);
        res.render('states/show', { state });
      } else {
        console.log('This state does not exist');
        res.render('404', { msg: 'state does not exist' });
      }
    })
    .catch(function (error) {
      console.log('ERROR', error);
    });
});







const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;













