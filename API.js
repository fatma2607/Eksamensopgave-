const express = require('express')
const { application } = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));



//User delen

//Hello Tuma
let users= [{
    id: 1,
    name:'fatma',
    interest:'eating',
    image:'image',
    match:[2,4,6,8,5],
    matched:[2,4,5],
    //array med ide'erne
},
    {
    id: 2,
    name:'sara',
    interest:'sleeping',
    image:'images',
    match:'girls',
    },

    {
    id: 3,
    name:'sara',
    interest:'sleeping',
    image:'images',
    match:'girls',
    },
    {
    id: 4,
    name:'sara',
    interest:'sleeping',
    image:'images',
    match:'girls',
    },
    {
        id: 5,
        name:'peder',
        interest:'eating',
        image:'image',
        likeusers:[2,4,6,1],
        match:[1],
        //array med ide'erne
    },
]
//Funktion OpretProfil()
//req.body = det der er i bodyen
app.post('/user',(req,res) => {

    let newUser = {
        //tilfædligt tal
        id:Math.random(),
        //sender de forskellige attributter
        name:req.body.name,
        interest:req.body.interest,
        image:req.body.image,
        match:req.body.match,
    }
    res.send(newUser);
})

//Funktion ShowFullProfile() henter fuldprofil?
app.get('/user/:id',(req,res) =>{
    let userid = req.params.id

    let user = users.find(function (u) { 
        return u.id==userid;
    });
    
    //error handling
    if(user){
        res.send(user); 
    }else{

        res.send(404,'user not found');
    }

   
})
//Funktion OpdaterProfil()
app.put('/user/:id',(req,res) => {
    let userid = req.params.id
    let user = users.find(function (u) { 
        return u.id==userid;
    });

    if(user){
        let change =req.body;
        //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
        let changedUser=Object.assign({},user,change);
        res.send(changedUser);
    }else{

        res.send(404,'user not found');
    }

});
//Funktion SletProfil()
app.delete('/user/:id',(req,res) =>{
    let userid = req.params.id
    let user = users.find(function (u) { 
        return u.id==userid;
    });
    if(user){
        //Her slettes brugeren i databasen
        res.send('Okay');
    }else{
        res.send(404,'user not found');
    }
});


//TODO:
//Funktion Login()
//Funktion Forbliv()
//Funktion LikeDislike()
// i min profil skal der være alle de id'er som jeg godt kan lide, og sara skal have de ider hun godt kan lide hvis dey indeholde rmin id så bliver vi et match

//Funktion DidLike()
//Funktion Logout()
//Funktion Match

//Interest delen
let interests=[{
    id:3,
    interest:['eating','smiling','jumping','hicking','ishockey']

},

{
    id:4,
    interest: ['sleeping','greeting','laughing','loving','driving'],

}
]

app.post('interests',(req,res) => {

    let newInterests = {
        interests:req.array.interest,
    }
    res.send(newInterests);
})

//interest
app.get('/interests/:id',(req,res) =>{
    let interestsid  = req.params.id
    let interests = users.find(function (i) { 
        return i.id==interests.id;
    });

    //error handling
    if(interests){
        res.send(interests); 
    }else{

        res.send(404,'user not found');
    }

   
})

//interst
app.put('/interets/:id',(req,res) => {
    let interestsid  = req.params.id
    let interests = users.find(function (i) { 
        return i.id==interests.id;
    });


    if(interests){
        let change =req.body;
        //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
        let changedInterests=Object.assign({},interests,change);
        res.send(changedInterests);
    }else{

        res.send(404,'interests not found');
    }

});

//interests
app.delete('/interets/:id',(req,res) =>{
    let interestsid = req.params.id
    let interests = users.find(function (u) { 
        return i.id==interests.id;
    });
    if(interests){
        //Her slettes interets i databasen
        res.send('Okay');
    }else{
        res.send(404,'no interets found');
    }
});

//match delen

let match =[{
    id: 1,
    match:[2,4,6,8,5],

},
{
    id:5,
    match: [1],

}

]

app.post('/match',(req,res) => {

    let newmatch = {
        match:req.array.match,
    }
    res.send(newmatch);
})
//Funktion Matches()
app.get('/match/:id',(req,res) =>{
    let matchid  = req.params.id
    let match = users.find(function (m) { 
        return m.id==match.id;
    });

    //error handling
    if(match){
        res.send(match); 
    }else{

        res.send(404,'No match found');
    }

   
})

app.put('/match/:id',(req,res) => {
    let matchid  = req.params.id
    let match = users.find(function (m) { 
        return m.id==match.id;
    });


    if(match){
        let change =req.body;
        //Alt fra brugerenn kommer ind i det tomme objekt, også kommer alt det fra change ind i objektet
        let changedmatch=Object.assign({},match,change);
        res.send(changedmatch);
    }else{

        res.send(404,'match not found');
    }

});
//Funktion RemoveMatch()
app.delete('/match/:id',(req,res) =>{
    let matchid = req.params.id
    let match = users.find(function (m) { 
        return m.id==match.id;
    });
    if(match){
        //Her slettes interets i databasen
        res.send('Match found!!');
    }else{
        res.send(404,'No match for you');
    }
});


app.listen(port,() => console.log(`Simple Express app listening on port ${port}!`))
//backend
