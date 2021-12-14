### National Parks

This web site will help you to explore National Parks in United States.

---

## User story

USA National Parks (Explore National Parks in US)

Who:
As a client:

What:

1. I want to create account.
2. I want to sign in.
3. I want to see my profile.
4. I want to see list of National Parks, mark park as a favorite, update favorite park, delete favorite park
5. I want to click on Park and see a picture and description about the Park.
6. I want to see list of the trails, mark trail as a favorite, update favorite trail, delete favorite trail
7. I want to click on trail and see information about the trail.

Why:

1. Explore National Parks in US.
2. Read about most popular National Parks and trails.

---

## ERD

![](img/Screen%20Shot%202021-12-07%20at%208.57.47%20PM.png)

---

## Wireframe

![](img/Screen%20Shot%202021-12-13%20at%2011.52.18%20AM.png)

---

## Code Snippets

## Retrieve a date using API

```javascript

axios.get('https://developer.nps.gov/api/v1/parks?limit=465&api_key=...')
  .then(response => {
    console.log('DATA HERE', Object.keys(response.data));
    console.log('DATA HERE');

    let array = response.data.data;
    for (let i = 0; i < array.length; i++) {
      let park = array[i];
      console.log(park.fullName);               //  see name
      console.log(park.description);            //  see about
      console.log(park.weatherInfo);            //  see weatherInfo

```

## Create a Park

```javascript
Park.create({
  name: park.fullName,
  about: park.description,
  city: park.addresses[1].city,
  state: park.states,
  weatherInfo: park.weatherInfo,
  img: park.images[0].url,
})
  .then(function (newParks) {
    console.log("NEW PARKS CREATED", newParks.toJSON());
  })
  .catch(function (error) {
    console.log("ERROR", error);
  });
```

## Create a GET route and find all parks that contained **National Park**

```javascript
app.get("/parks", function (req, res) {
  Park.findAll({
    where: {
      name: {
        [Op.substring]: "National Park",
      },
    },
  })
    .then(function (parksList) {
      console.log("FOUND ALL PARKS", parksList);
      res.render("parks", { parks: parksList });
    })
    .catch(function (error) {
      console.log("ERROR", error);
      res.json({ msg: "Error occured" });
    });
});
```

## Validation

```javascript

Park.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: DataTypes.TEXT,
    weatherInfo: DataTypes.TEXT,
    city:
    {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img: DataTypes.STRING,
    stateId: DataTypes.INTEGER,
    parkId: DataTypes.INTEGER
  },

```

## Display **Grand Canyon National Park** only

```javascript
<% for( let i = 0; i < parks.length; i++ ) { %>
              <% let a = parks[i]; %>
              <% a = a.toJSON() %>
              <% if(a.name === 'Grand Canyon National Park'){%>
               <p> <%= a.about %> </p>
               <% break; %>
               <% }%>
               <% }%>

```

---

## Routing

| Method | Path         | Location  | Purpose      |
| ------ | ------------ | --------- | ------------ |
| GET    | /auth/login  | auth.js   | Login form   |
| GET    | /auth/signup | auth.js   | Signup form  |
| POST   | /auth/login  | auth.js   | Login user   |
| POST   | /auth/signup | auth.js   | Creates user |
| GET    | /profile     | server.js | User profile |
| GET    | /            | server.js | Home page    |
| POST   | /trails/id   | server.js | Create trail |
| PUT    | /trails/edit | server.js | Edit trail   |
