const http = require("http");
const fs= require("fs");
var request= require("request");

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal= (tempVal ,orgVal)=>{
    let temperature= tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature= temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature= temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature= temperature.replace("{%location%}",orgVal.name);
    temperature= temperature.replace("{%country%}",orgVal.sys.country);
    temperature= temperature.replace("{%country%}",orgVal.weather[0].main);

    return temperature;
}

const server= http.createServer((req,res)=>{
    if(req.url=="/"){
        request("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=a8245945a87d81768e5c1d4898abf750&units=metric")
        .on("data",(chunk)=>{
            const objdata= JSON.parse(chunk);
            const arrdata=[objdata]
            //console.log(arrdata[0].main.temp);

            // mapping arrdata into map and then calling replace value fucntion
            const realTimeData= arrdata.map((val)=>replaceVal(homeFile,val)).join("");// join ate the end converts data from array to string 

            res.write(realTimeData);

            //console.log(realTimeData);
        })
        .on("end",(err)=>{
            if(err) return console.log("connection closed due to errors",err);
           res.end();
        });
    }
    
});

server.listen(4000, "127.0.0.1",()=>{
    console.log("listening on port number 4000");
});