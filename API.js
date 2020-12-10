const path = require("path"); 
const express = require("express");
//hvorfor er der to require express?
const { application } = require("express");
//med appen får vi forskelliige ting
const app = express();
//"Process.env.PORT"= vi vil se på omgivelserne
const PORT = process.env.PORT || 5000; 
//når man kører på serveren får man nogret tilbage
//"BodyParser" = Til mine users
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//Virker som i browseren
const fetch = require("node-fetch");
const fs = require("fs");
//installere id'er
const { v4: uuidv4 } = require('uuid');
//Til at bruge images
app.use(express.static(__dirname + '/images'));

//Variabler til hele vores applikation
app.locals.myusers =  require('./users.json');
app.locals.shownextprofile = 0;
app.locals.loggedin = 0;
app.locals.loggedinuseremail = "Startemail@gmail.com";
app.locals.loggedinuserindex = 0;
app.locals.matches = app.locals.myusers[0].match;
app.locals.loggedinuserid = 0;
app.locals.mypotentialmatches = require('./users.json');

//Link til htmlllll,,,,,

/* app.get("/", (req, res) => {t
  res.sendFile(path.join(__dirname,"index.html"));
}); */

//Mine controllere
//Til vores ejs
app.get("/", (req, res) => {
  //render læser alt hvad vi har indeni vores fil
  res.render(path.join(__dirname,"/views/index.ejs"));
});

app.get("/views/showprofile", (req, res) => {
  //render læser alt hvad vi har indeni vores fil
  res.render(path.join(__dirname,"/views/showprofile.ejs"));
});

app.get("/opretprofile", (req, res) => {
  res.render(path.join(__dirname,"/views/opretprofile.ejs"));
});

app.get("/views/login", (req, res) => {
  res.render(path.join(__dirname,"/views/login.ejs"));
});

app.listen(PORT, () =>
  console.log(`Simple Express app listening on port ${PORT}!`)
);

app.get("/logout", (req, res) => {
  //render læser alt hvad vi har indeni vores fil
  //her kommer funktionen hvor vi logger brugeren ud og sender brugeren til startsiden

  res.render(path.join(__dirname,"/views/index.ejs"));
});

app.get("/views/potentialmatch", (req, res) => {

  //Tag my users og giv mig kun dem som opfylder følgende kriterie
  app.locals.mypotentialmatches = app.locals.myusers.filter(function(item){
  return item.gender == "male";
  
});



  res.render(path.join(__dirname,"/views/potentialmatch.ejs"));
});

app.get("/views/matches", (req, res) => {
  res.render(path.join(__dirname,"/views/matches.ejs"));
});




//Få alle brugere: Function GetUsers()

app.get("/users", (req, res) => {
  try {
    const users = require("./users.json");
    res.send(users);
  } catch (error) {
    console.error(error);
  }
});

//Login
app.post("/login", (req, res) => {

  
  let useremail = req.body.email;
  let userpassword = req.body.password;
    
  //Få vores brugere til vores localstorgae
    //Vi giver vores localstorage en værdi
  //window.localStorage.setItem('loggedinuserid', "hej det er tuma");

  //console.log("This is the email " + req.body.email);

  //console.log("This is the password " + req.body.password);

  //til at sammenligne om det passer, vi loader alle brugerene op i users
  const users = require("./users.json");

  //"find" finder brugeren med den samme email
  let user = users.find(function (u) {
    //find ud af om email og password passer,og brugeren ikke er deleted u er det vi henter fra vores json fil
  return u.email == useremail && u.password == userpassword && u.deleted == 0
  });
  //hvis brugeren er blevet defineret
  if (user) {
    //vil vi gerne finde indexet på den bruger vi har fundet
    let founduserindex = users.findIndex(function (u) {
      //find på username, da brugeren er fundet
      return u.email == useremail ;
      });
      //hvis brugeren er fundet er brugeren logget ind
      //sæt brugeren logget ind lige 1, så det kan ændres til 1 i vores users.json
      
      users[founduserindex].loggedin = 1;
      //console.log("her sætter vi useremail ved login" + useremail);
      //sæt også lige loginbrugerindex så vi kan bruger på andre sider
      app.locals.loggedinuserindex = founduserindex;

      //app.locals.loggedinuseremail = useremail;

      //let change = user
      //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
      //let changedUser = Object.assign({}, user, change);
      
      //Så vi kan få den ændret bruger (changedUser) ind i vores users.json fil
      
      //users[founduserindex] = changedUser;  
    

//console.log(JSON.stringify(users));

  const USERS_ENDPOINT = './users.json';
  fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));
  
  app.locals.loggedinuseremail = useremail;

  res.render(path.join(__dirname,"/views/showprofile.ejs"));

  //res.send(user);
  
  } else {
  res.send(404, "user not found");
  }
  });

//Logud
app.post("/logout", (req, res) => {

  //kigger på emailen som vi sender i vores request
  let useremail = req.body.email;
  //Den kunne ikke finde brugeren så vi fejlfinder ved at brueg console.log, til at finde ud af hvorfor
//console.log("Users email is " + req.body.email);

  //vi sammenligner emailen med vores brugere
  const users = require("./users.json");

  //"find" finder brugeren med den samme email
  let user = users.find(function (u) {
    //find ud af om email og password passer
  return u.email == useremail;
  });
  //hvis brugeren er blevet defineret
  if (user) {
    //vil vi gerne finde indexet på den bruger vi har fundet
    let founduserindex = users.findIndex(function (u) {
      //find på username, da brugeren er fundet
      return u.email == useremail ;
      });
      //Er brugeren logget ind? 0 er falsk, og 1 er true
      //Sæt brugeren til logget ud som er 0
      users[founduserindex].loggedin = 0;

      //let change = user
      //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
      //let changedUser = Object.assign({}, user, change);
      
      //Så vi kan få den ændret bruger (changedUser) ind i vores users.json fil
      
      //users[founduserindex] = changedUser;  
    

//console.log(JSON.stringify(users));

  const USERS_ENDPOINT = './users.json';
  fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));

//Når brugeren er logget ud vil vi sende brugerne til startsiden
  res.render(path.join(__dirname,"/views/index.ejs"));

  //res.send(user);
  
  } else {
  res.send(404, "could not log user out");
  }
  });

//Funktion OpretUser()
//req.body = det der er i bodyen
app.post("/user", (req, res) => {
    const USERS_ENDPOINT = './users.json';
    const users = require(USERS_ENDPOINT);
    
    
    let newUser = {
        id:uuidv4(),
        name: req.body.name,
        age: req.body.age,
        //username
        email:req.body.email,
        //password
        password:req.body.password,
        gender:req.body.gender, 
        interests: Array.isArray(req.body.interests) ? req.body.interests : [req.body.interests],
        city:req.body.city,
        image:req.body.image,
    };
  
       users.push(newUser)
//Ænder noget i voreS json fil
    try {
        fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));
        console.log("user is created", newUser);
        res.send(200, 'User is created');
    } catch (error) {
        console.error(err);
        res.send(500, err.message);
    }
// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

});


/* app.post("/updateuser", (req, res) => {



  res.send("Hello");


console.log("Update Function Works");


});


 */
//Funktion OpdaterProfil() TODO: Måske bliver denne her funktion ikek brugt, måske slet
// app.post("/updateusertest", (req, res) => {

//   //let userid = req.params.id;
  
// let userid = "ebea2ab5-c45c-453d-973e-fdafaaa1614d" 
 

//   if (userid == "ebea2ab5-c45c-453d-973e-fdafaaa1614d") {
//     let change = req.body;
//     //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
    
//     res.send("User Updated");
//   } else {
//     res.send(404, "Hello - user not found");
//   }
// });



//Funktion OpdaterProfil()
app.post("/updateuser", (req, res) => {

  let userid = req.body.id;
  //let userid = "ebea2ab5-c45c-453d-973e-fdafaaa1614d" 
  
  const users = require("./users.json");

  //"find" finder brugeren med id
  let user = users.find(function (u) {
  return u.id == userid;
  });
  if (user) {

    let founduserindex = users.findIndex(function (u) {
      return u.id == userid;
      });

    let change = req.body;
  //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
  let changedUser = Object.assign({}, user, change);
  
  //Så vi kan få den ændret bruger (changedUser) ind i vores users.json fil
  
  users[founduserindex] = changedUser;

  const USERS_ENDPOINT = './users.json';
  fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));

  
  res.send(changedUser);
  
  } else {
  res.send(404, "user not found");
  }
  });

//Funktion ShowFullProfile() henter fuldprofil
app.get("/user", (req, res) => {
    const users = require("./users.json");
    let userid = req.body.id;

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

//Funktion deleteuser
app.post("/deleteuser", (req, res) => {

  //kigger på emailen som vi sender i vores request
  let useremail = req.body.email;
  //Den kunne ikke finde brugeren så vi fejlfinder ved at brueg console.log, til at finde ud af hvorfor
console.log("Users email is " + req.body.email);

  //vi sammenligner emailen med vores brugere
  const users = require("./users.json");

  //"find" finder brugeren med den samme email
  let user = users.find(function (u) {
    //find ud af om email og password passer
  return u.email == useremail;
  });
  //hvis brugeren er blevet defineret
  if (user) {
    //vil vi gerne finde indexet på den bruger vi har fundet
    let founduserindex = users.findIndex(function (u) {
      //find på username, da brugeren er fundet
      return u.email == useremail ;
      });
      //Er brugeren logget ind? 0 er falsk, og 1 er true
      //Sæt brugeren til logget ud som er 0
      users[founduserindex].deleted = 1;

//console.log(JSON.stringify(users));

  const USERS_ENDPOINT = './users.json';
  fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));

//Når brugeren er logget ud vil vi sende brugerne til startsiden
  res.render(path.join(__dirname,"/views/index.ejs"));

  //res.send(user);
  
  } else {
  res.send(404, "could not delete user");
  }
  });

//Funktion Didlike(//Useren som er liket skal tilføjes til den person som har liket


app.post("/didlike", (req, res) => {

  let useremail = req.body.loggedinuseremail;
  let loggedinuserid = req.body.loggedinuserid;
  //Her fanger vi id'den på usern som vi liker
  //console.log("det her logged in user email" + app.locals.loggedinuseremail);
  
  let likeuserid = req.body.id;
  const users = require("./users.json");

//"find" finder brugeren med den samme email
let user = users.find(function (u) {
  //find ud af om email og password passer,og brugeren ikke er deleted u er det vi henter fra vores json fil
return u.email == useremail && u.deleted == 0
});
//hvis brugeren er blevet defineret
if (user) {
  //vil vi gerne finde indexet på den bruger vi har fundet
  let founduserindex = users.findIndex(function (u) {
    //find på username, da brugeren er fundet
    return u.email == useremail ;
    });
    

//Our solution
//Vi skal indsætte det i et JSON array, Str: string
var jsonStr = users[founduserindex];


//Opretter et objekt, som er vores JSON string der bliver lavet om.
var obj = jsonStr;


obj['like'].push({"id":likeuserid});




    //jsonStr = JSON.stringify(obj);

  
//Vores match function begynder her


//Vi vil gerne have den likets profils index, så vi kan arbejde med brugeren, den returnere likeduserindex, dne er lavet lidt bagom
let likeduserindex = users.findIndex(function (u) {
  //find på username, da brugeren er fundet
  return u.id == likeuserid;
  });


//Nu søger vi i den likets profils matches
  

//users[founduserindex].like = users[founduserindex].like;
  

//console.log("loggedinuserid is " + loggedinuserid);

//console.log("likeduserindex is " + likeduserindex);

  //Vi finder den logget inds id i den likedusers id
  let foundusermatched = app.locals.myusers[likeduserindex].like.find(function (u) {
    //find på username, da brugeren er fundet
    
    
    
    return u.id == loggedinuserid ;
    });
  //find hvilke personer den mar har liket også har liket
  //hvis vores user id er i personens like skal der være et match
  
  //console.log("look into this users like which is " + JSON.stringify(app.locals.myusers[likeduserindex].like));

  if (foundusermatched) {
    //like user also likes loggedin user
    

    console.log("Hurray -match");


//Push match on logged in user


var jsonStr = users[founduserindex];


//Opretter et objekt, som er vores JSON string der bliver lavet om.
var obj = jsonStr;

obj['match'].push({"id":likeuserid});


//Push match on likeduser

var jsonStr = users[likeduserindex];
var obj = jsonStr;
obj['match'].push({"id":loggedinuserid});
    
 

  }


//End of match function


}

  //users[founduserindex].like = users[founduserindex].like;

  

  //Personen er blevet liket, vis næste profil
  app.locals.shownextprofile = app.locals.shownextprofile + 1;


  const USERS_ENDPOINT = './users.json';
  fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));

  //Når man liker skal man vende tilbage til potentialmath siden
  res.render(path.join(__dirname,"/views/potentialmatch.ejs"));



});
//Funktion removematches
app.post("/removematches", (req, res) => {


  let useremail = req.body.loggedinuseremail;

  //let unmatcheduserid = req.body.id;

  let unmatcheduserid = "18136201-ab68-49fb-9b94-ff1b93357781";
  const users = require("./users.json");


  //"find" finder brugeren med den samme email
let user = users.find(function (u) {
  //find ud af om email og password passer,og brugeren ikke er deleted u er det vi henter fra vores json fil
return u.email == useremail && u.deleted == 0
});

console.log("User is  " + user);
console.log("user email is equal to " + useremail);

if (user) {
  //vil vi gerne finde indexet på den bruger vi har fundet
  let founduserindex = users.findIndex(function (u) {
    //find på username, da brugeren er fundet
    return u.email == useremail ;
    });
    
  
//Vi sætter JSON string lige vores fundet index
var jsonStr = users[0];

//console.log("This is the jsonStr value " + JSON.stringify(users[founduserindex]));

//Opretter et objekt, som er vores JSON string der bliver lavet om.
var obj = jsonStr;



//Gå ind på den logget inds profils matches(hnnah), går ind på hannahs index,finder den unmatchets id og returner indexet på den
let unmatchedindex = app.locals.myusers[0].match.findIndex(function (u) {
  //find på username, da brugeren er fundet
  return u.id == unmatcheduserid ;
  });

  //når man så har den unmatcheds index kan man fjerne det, vi bruger index fordi splice skal bruge et index

  //1 står for hvor mange af dem vi skal slette
  //jsonStr.splice(unmatchedindex, 1);

  obj['match'].splice(unmatchedindex, 1);


  //users = removedjsonStr;


console.log("unmatcheduserindex er " + unmatchedindex);

    const USERS_ENDPOINT = './users.json';
    fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));


  }


  //render læser alt hvad vi har indeni vores fil
  res.render(path.join(__dirname,"/views/showprofile.ejs"));
});




//Man disliker og vil vise den nye profil, derfor har vi funktonen dislike
app.post("/dislike", (req, res) => {


  let useremail = req.body.loggedinuseremail;


  console.log("This is the logged in user email" + req.body.loggedinuseremail);
  //Her fanger vi id'den på usern som vi liker
  //console.log("det her logged in user email" + app.locals.loggedinuseremail);
  
  let dislikeuserid = req.body.id;


console.log("This is the dislike id" + req.body.id);
  const users = require("./users.json");

//"find" finder brugeren med den samme email
let user = users.find(function (u) {
  //find ud af om email og password passer,og brugeren ikke er deleted u er det vi henter fra vores json fil
return u.email == useremail && u.deleted == 0
});
//hvis brugeren er blevet defineret
if (user) {
  //vil vi gerne finde indexet på den bruger vi har fundet
  let founduserindex = users.findIndex(function (u) {
    //find på username, da brugeren er fundet
    return u.email == useremail ;
    });
    
  
  
//Vi skal indsætte det i et JSON array, Str: string
var jsonStr = users[founduserindex];

//console.log("This is the jsonStr value " + JSON.stringify(users[founduserindex]));

//Opretter et objekt, som er vores JSON string der bliver lavet om.
var obj = jsonStr;


obj['dislike'].push({"id":dislikeuserid});


    app.locals.shownextprofile = app.locals.shownextprofile + 1;


    const USERS_ENDPOINT = './users.json';
    fs.writeFileSync(USERS_ENDPOINT, JSON.stringify(users,null,4));
  
    //Personen er blevet liket, vis næste profil
    app.locals.shownextprofile = app.locals.shownextprofile + 1;
  
    //Når man liker skal man vende tilbage til potentialmath siden
    res.render(path.join(__dirname,"/views/potentialmatch.ejs"));

  }

});


//glem dette pt
//Funktion SletProfil()
/* app.delete("/user/:id", (req, res) => {
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
}); */

//TODO:
//Funktion Likeshownextprofile()
//Funktion DidLike()
//Funktion Logout()
//Funktion Match

//glem dette pt
//interests
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
//glem denne del
//match delen




/* let match = [
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
}); */
/* //Funktion RemoveMatch()
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
}); */

//backend
