var { spawn } = require('child_process');
var express = require('express');
var bodyparser = require('body-parser');
const { resolve } = require('path');
var urlencodedparser = bodyparser.urlencoded({extended:false})
const app = express();
const fs = require('fs')

// support parsing of application/json type post data
app.use(bodyparser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyparser.urlencoded({ extended: true }));

app.listen(8080, () => {
    console.log("Web app live at localhost:8080");
});
  
app.use(express.static('public'));

app.post("/getpagecontent", urlencodedparser, async (request, response) => {
    await getresponsefromgetpagecontentpy(request.body.searchword).then((data) => {
        response.status(200);
        response.send(data);
    }, (error) => {
        response.status(400);
        response.send(error);
    });
});

app.post("/getsuggestion", urlencodedparser, async (request, response) => {
    await getresponsefromgetsuggestionpy(request.body.searchword).then((data) => {
        response.status(200);
        response.send(data);
    }, (error) => {
        response.status(400);
        response.send(error);
    });
});

app.post("/getresponsechatbot", async (request, response) => {
    await getresponsefromchatbotpy(request.body.searchword, request.body.text).then((data) => {
        response.status(200);
        response.send(data);
    }, (error) => {
        response.status(400);
        console.log(error.message);
        response.send(error.message);
    });
});

function getresponsefromgetpagecontentpy(suggestion){
    return new Promise((resolve, reject) => {
        var spawnvar = spawn('python', ['./getpagecontent.py', suggestion]);
        try{    
            spawnvar.stdout.on('data', async (data) => {
                var datastr = String(data);
                // var emptyjsonstr = '{}';
                var json = { wikidata: [datastr] };
                var emptyjson = { wikidata: [""] };
                // await fs.readFile('./public/data.json', function (err, data) {
                //     var jsonarr = new Array();
                //     var json = {
                //         wikidata: jsonarr
                //     };
                //     jsonarr.push(json);    
                //     fs.writeFile("./public/data.json", jsonarr[0], function(err){
                //       if (err) throw err;
                //       console.log('The "data to append" was appended to file!');
                //     });
                // })
                // var jsonstr = '{"wikidata": "'+datastr+'"}';
                fs.writeFile("./public/data.json", JSON.stringify(emptyjson), () => {
                    fs.writeFile("./public/data.json", JSON.stringify(json), () => {
                        console.log(datastr);
                        resolve(datastr);
                    }); 
                });
               
                // fs.writeFile("./public/data.json", emptyjsonstr, () => {
                    
                // });
            });
        }catch{
            reject("Unable to connect to wikipedia");
        }
    });
}

function getresponsefromgetsuggestionpy(searchword){
    return new Promise((resolve, reject) => {
        var spawnvar = spawn('python', ['./getsuggestion.py', searchword]);
        try{    
            spawnvar.stdout.on('data', (data) => {
                console.log(String(data));
                resolve(String(data));
            });
        }catch{
            reject("Unable to connect to wikipedia");
        }
    });
}

function getresponsefromchatbotpy(searchword, text){
    return new Promise((resolve, reject) => {
        var spawnvar = spawn('python', ['./chatbot.py', searchword, text]);             ///DONT USE SPAWN AS VARIABLE NAME
        try{
            spawnvar.stdout.on('data', function(data) {
                resolve(String(data));   
            });
        }catch{
            reject("Unable to get response");
        }
    });
}