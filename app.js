//use express
const express = require('express');
const app = express();
//body parser for reading data
const bodyParser = require('body-parser');
const { json } = require('express');
const https = require('https')
app.use(bodyParser.urlencoded({extended: true}));

//sending public folder with css and images
app.use(express.static("public"));

//api key from monkey 
const apiKey = ""; //HERE ADD APIKEY
//servername from the end of the apikey smthing like u3
const serverName = ""; //HERE ADD SERVER NAME
//list ID
const listID ="";//HERE ADD LIST ID
//API Adress
const apiUrl = `https://${serverName}.api.mailchimp.com/3.0/lists/${listID}`;


//send sign in form
app.get('/',(req,res)=>{
  res.sendFile(__dirname+"/signin.html");
});


app.post('/',(req,res)=>{
  const fName= req.body.fName;
  const lName=req.body.lName;
  const mail= req.body.mail;
  const data = {
    members: [{
      email_address: mail,
      status: "subscribed",
      merge_fields:{
        FNAME: fName,
        LNAME:lName
        }
    }]
  }
  //change string info the json format
  const jsonData = JSON.stringify(data);

  //options for https request
  const options = {
    method: "POST",
    auth:`ula:${apiKey}`
  };
  
  const request = https.request(apiUrl, options, (response) => {
    response.on("data", (data)=>{
      console.log(JSON.parse(data))
    })
    response.statusCode===200? 
    res.sendFile(__dirname+"/sucess.html") : res.sendFile(__dirname+"failure.html");
  });

  request.write(jsonData);
  request.end();

  
  
});

app.post('/failure', (req,res)=>{
  res.redirect('/');
})

//send app to localhost
app.listen(process.env.PORT||3000, (req,res)=>{
  console.log("yes, yes, I'm listning on local:3000");
});