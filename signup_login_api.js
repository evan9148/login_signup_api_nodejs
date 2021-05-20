var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var port = 1600;


const knex = require("knex")({
    client: "mysql",
    version: '7.2',
    connection: {
      host: "localhost",
      user: "root",
      password: "Navgurukul123#@!",
      database: "login_signup_api"
    }
})


knex.schema.hasTable("user_details").then( (exits) => {
    if (!exits) {
        return knex.schema.createTable("user_details",(table) => {
            table.increments("id").primary();
            table.string("username",100);
            table.string("email",100);
            table.string("password",20);
            table.string("confirm_password",20);
        })
    }
}) 


app.post("/signup", (req,res) => {
    // knex.select("*").from("users").then((data) => {
    //     console.log(data)
    // })
    knex.select('email').from('user_details').where('email', req.body.email)
    .then((data) => {
        // console.log(data)
        if (data.length > 0){
            res.send("your email allready used...  ")
            console.log("your email allready used...  ")
        }
        else {
            knex("user_details")
                .insert({
                        username : req.body.username,
                        email : req.body.email,
                        password : req.body.password,
                    })
                    .then(() => {
                        console.log("your details are created.... ")
                        res.send("your details are created.... ")
                    }).catch((error) => {
                        console.log("went wrong.... ")
                        res.send(error)
                    })
        }
    }).catch((error) => {
        console.log(error)
        res.send(error)
    })
})

app.post("/login" , (req,res) => {
    console.log(req.body.email, " email....")
    knex.select("email").from("user_details").where("email", req.body.email).andWhere("password",req.body.password)
    .then((data) => {
        if (data.length){
            console.log("congrats! " , "you have logged in successfully...  ")
            res.send("logged in successfully ")
        }else if (!data.length) {
            console.log("Invaild email and password...! ")
            res.send("Invaild email and password...!   ")
        }
    }).catch((err) => {
        console.log(err)
        res.send(err)  
    })
});

app.listen(port, () => {
    console.log(`your port is running ${port}`)
})