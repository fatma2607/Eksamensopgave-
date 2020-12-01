const express = require("express");
//hvorfor er der to require express?
const { application } = require("express");
//med appen får vi forskelliige ting
const app = express();
//"Process.env.PORT"= vi vil se på omgivelserne
const PORT = process.env.PORT || 5000;
//når man kører på serveren får man noget tilbage
//"BodyParser" = Til mine users
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//Virker som i browseren
const fetch = require("node-fetch");
const fs = require("fs");

//Link til htmlllll

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "my.html"));
});

app.listen(PORT, () =>
  console.log(`Simple Express app listening on port ${PORT}!`)
);

//Få alle brugere: Function GetUsers()

app.get("/users", (req, res) => {
  try {
    const users = require("./users.json");
    res.send(users);
  } catch (error) {
    console.error(error);
  }
});

//Funktion OpretUser()
//req.body = det der er i bodyen
app.post("/user", (req, res) => {
    const USERS_ENDPOINT = './users2.json';
    const users = require(USERS_ENDPOINT);
 
    let newUser = {
        id: Math.random(),
        name: req.body.name,
        interest: req.body.interest,
        image: req.body.image,
        match: req.body.match,
        
    };
    // const newUser = {
    //     "id": 1,
    //     "name": "Selena",
    //     "age": 25,
    //     "hobbies": ["Weight Lifting", "Bowling", "Eating"]
    // };
       users.push(newUser)
//Ænder noget i voreS json fil
    try {
        fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users));
        console.log("user is created", newUser);
        res.send(200, 'ok');
    } catch (error) {
        console.error(err);
        res.send(500, err.message);
    }
// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

});

//Funktion ShowFullProfile() henter fuldprofil?
app.get("/user/:id", (req, res) => {
    const users = require("./users.json");
    let userid = req.params.id;

  let user = users.find(function (u) {
    return u.id == userid;
  });

  //error handling
  if (user) {
    res.send(user);
  } else {
    res.send(404, "user not found");
  }
});
//Funktion OpdaterProfil()
app.put("/user/:id", (req, res) => {
  let userid = req.params.id;
  let user = users.find(function (u) {
    return u.id == userid;
  });

  if (user) {
    let change = req.body;
    //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
    let changedUser = Object.assign({}, user, change);
    res.send(changedUser);
  } else {
    res.send(404, "user not found");
  }
});
//Funktion SletProfil()
app.delete("/user/:id", (req, res) => {
  let userid = req.params.id;
  let user = users.find(function (u) {
    return u.id == userid;
  });
  if (user) {
    //Her slettes brugeren i databasen
    res.send("Okay");
  } else {
    res.send(404, "user not found");
  }
});

//TODO:
//Funktion Login()
//Funktion Forbliv()
//Funktion LikeDislike()
//Funktion DidLike()
//Funktion Logout()
//Funktion Match

//Interest delen
let interests = [
  {
    id: 3,
    interest: ["eating", "smiling", "jumping", "hicking", "ishockey"],
  },

  {
    id: 4,
    interest: ["sleeping", "greeting", "laughing", "loving", "driving"],
  },
];

app.post("interests", (req, res) => {
  let newInterests = {
    interests: req.array.interest,
  };
  res.send(newInterests);
});
// i min profil skal der være alle de id'er som jeg godt kan lide, og sara skal have de ider hun godt kan lide hvis dey indeholde rmin id så bliver vi et match
//interest
app.get("/interests/:id", (req, res) => {
  let interestsid = req.params.id;
  let interests = users.find(function (i) {
    return i.id == interests.id;
  });

  //error handling
  if (interests) {
    res.send(interests);
  } else {
    res.send(404, "user not found");
  }
});

//interst
app.put("/interets/:id", (req, res) => {
  let interestsid = req.params.id;
  let interests = users.find(function (i) {
    return i.id == interests.id;
  });

  if (interests) {
    let change = req.body;
    //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
    let changedInterests = Object.assign({}, interests, change);
    res.send(changedInterests);
  } else {
    res.send(404, "interests not found");
  }
});

//interests
app.delete("/interets/:id", (req, res) => {
  let interestsid = req.params.id;
  let interests = users.find(function (u) {
    return i.id == interests.id;
  });
  if (interests) {
    //Her slettes interets i databasen
    res.send("Okay");
  } else {
    res.send(404, "no interets found");
  }
});

//match delen

let match = [
  {
    id: 1,
    match: [2, 4, 6, 8, 5],
  },
  {
    id: 5,
    match: [1],
  },
];

app.post("/match", (req, res) => {
  let newmatch = {
    match: req.array.match,
  };
  res.send(newmatch);
});
//Funktion Matches()
app.get("/match/:id", (req, res) => {
  let matchid = req.params.id;
  let match = users.find(function (m) {
    return m.id == match.id;
  });

  //error handling
  if (match) {
    res.send(match);
  } else {
    res.send(404, "No match found");
  }
});

app.put("/match/:id", (req, res) => {
  let matchid = req.params.id;
  let match = users.find(function (m) {
    return m.id == match.id;
  });

  if (match) {
    let change = req.body;
    //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
    let changedmatch = Object.assign({}, match, change);
    res.send(changedmatch);
  } else {
    res.send(404, "match not found");
  }
});
//Funktion RemoveMatch()
app.delete("/match/:id", (req, res) => {
  let matchid = req.params.id;
  let match = users.find(function (m) {
    return m.id == match.id;
  });
  if (match) {
    //Her slettes interets i databasen
    res.send("Match found!!");
  } else {
    res.send(404, "No match for you");
  }
});

//backend
