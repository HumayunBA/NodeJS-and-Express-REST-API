var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//External API

let apiKey = 'cdfa7eb4d222fca0ab0a49d1fcff3576';
let city = 'delhi';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`


request(url, function(err, res, body){
    if(err){
      console.log('Error: ', err);
    } else{
      console.log('Body: ', body);
    }
  });


app.get('/', function(req, res){
    res.render('index');
  })


app.post('/', function (req, res) {
let city = req.body.city;
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
request(url, function (err, response, body) {
    if(err){
    res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
    let weather = JSON.parse(body)
    if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
    }
    }
});
});



  //Internal API

  //placeholders for added task
var task = [];
//placeholders for removed task
var complete = [];

//post route for adding new task 
app.post("/addtask", function(req, res) {
    var newTask = req.body.newtask;
    //add the new task from the post route
    task.push(newTask);
    res.redirect("/");
});

app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
    //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

//render the ejs and display added task, completed task



app.get("/", function(req, res) {    
  res.render("index", { task: task, complete: complete});
  
});



app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), function(){
      console.log('Server listening on port ' +app.get('port'));
});

