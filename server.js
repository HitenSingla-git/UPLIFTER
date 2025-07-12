var express = require("express");
var fileUploader = require("express-fileupload");
var cloudinary = require("cloudinary").v2;
var mysql2 = require("mysql2");
var app = express();

//for style and script files
app.use(express.static("public"));


app.listen(2006, function () {
    console.log("server started");
})

//for style and script files
app.use(express.static("public"));






app.get("/", function (req, resp) {
    let pathname = __dirname + "/public/index.html";
    resp.sendFile(pathname);
})



//Connecting to DB==========================================
let dbConfig = "mysql://avnadmin:AVNS_fcItw1lhViKFu2S4DUH@mysql-1cacbe68-hitensingla2006-8a4d.i.aivencloud.com:18852/defaultdb";

let mySqlServer = mysql2.createConnection(dbConfig);

mySqlServer.connect(function (err) {
    if (err != null) {
        console.log(err.message);
    }
    else
        console.log("Connected to DB")

})
//--------------------------------------------------------------------------

//========cloudinary=================================================================

app.use(express.urlencoded(true)); //convert POST data to JSON object
app.use(fileUploader());//to recv. and upload pic on server from client

cloudinary.config({
    cloud_name: 'dsyr3j3so',
    api_key: '455625949393516',
    api_secret: 'UfAv-vAKchnc51XZOPXtDfPMeDM'
});
//----------------------------------------------------------------------------

app.get("/signup", function (req, resp) {
    mySqlServer.query("insert into users values(?,?,?,current_date(),?)", [req.query.EMAIL, req.query.PASSWORD, req.query.USERTYPE, 1], function (err) {
        if (err != null) {
            resp.send(err.message);
        }
        else
            resp.send("signup successfull");

    })



})
app.get("/login", function (req, resp) {
    mySqlServer.query("SELECT * FROM users WHERE email=? AND pwd=?", 
    [req.query.EMAIL, req.query.PASSWORD], 
    function (err, result) {
        if (err) {
            console.log(err);
            resp.status(500).send({ message: "Server error" });
            return;
        }

        if (result.length === 0) {
            resp.status(401).send({ message: "Invalid email or password" });
        } else {
            resp.send({ utype: result[0]["utype"] });  // returns { utype: 'client' } or 'volunteer'
        }
    });
});


app.get("/vkyc", function (req, resp) {
    let pathname1 = __dirname + "/public/vol-kyc.html";
    resp.sendFile(pathname1);
})


app.post("/volkyc", async function (req, resp) {
    let inputEmail4 = req.body.inputEmail4;
    let inputname = req.body.inputname;
    let inputnumber = req.body.inputnumber;
    let inputAddress = req.body.inputAddress;
    let inputCity = req.body.inputCity;
    let gen = req.body.gen;
    let inputdob = req.body.inputdob;
    let inputqual = req.body.inputqual;
    let inputoccu = req.body.inputoccu;
    let inputoth = req.body.inputoth;


    let fileName;
    if (req.files != null) {
        fileName = req.files.profilepic.name;
        let locationToSave = __dirname + "/public/uploads/" + fileName;//full ile path
        req.files.profilepic.mv(locationToSave);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        await cloudinary.uploader.upload(locationToSave).then(function (picUrlResult) {
            fileName = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName);
        });
    }
    else
        fileName = "nopic.jpg";

    let fileName1;
    if (req.files != null) {
        fileName1 = req.files.profilepic1.name;
        let locationToSave1 = __dirname + "/public/uploads/" + fileName1;//full file path
        req.files.profilepic1.mv(locationToSave1);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        await cloudinary.uploader.upload(locationToSave1).then(function (picUrlResult) {
            fileName1 = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName1);
        });
    }
    else
        fileName1 = "nopic.jpg";


    mySqlServer.query("insert into tablekyc values(?,?,?,?,?,?,?,?,?,?,?,?)", [inputEmail4, inputname, inputnumber, inputAddress, inputCity, gen, inputdob, inputqual, inputoccu, inputoth, fileName, fileName1], function (err) {
        if (err == null) {
            resp.send("Record Saved");
        }
        else
            resp.send(err.message);
    })
})


app.post("/update", async function (req, resp) {
    let inputEmail4 = req.body.inputEmail4;
    let inputname = req.body.inputname;
    let inputnumber = req.body.inputnumber;
    let inputAddress = req.body.inputAddress;
    let inputCity = req.body.inputCity;
    let gen = req.body.gen;
    let inputdob = req.body.inputdob;
    let inputqual = req.body.inputqual;
    let inputoccu = req.body.inputoccu;
    let inputoth = req.body.inputoth;


    let fileName;
    if (req.files != null) {
        fileName = req.files.profilepic.name;
        let locationToSave = __dirname + "/public/uploads/" + fileName;//full ile path
        req.files.profilepic.mv(locationToSave);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        await cloudinary.uploader.upload(locationToSave).then(function (picUrlResult) {
            fileName = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName);
        });
    }
    else
        fileName = "nopic.jpg";

    let fileName1;
    if (req.files != null) {
        fileName1 = req.files.profilepic1.name;
        let locationToSave1 = __dirname + "/public/uploads/" + fileName1;//full file path
        req.files.profilepic1.mv(locationToSave1);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        await cloudinary.uploader.upload(locationToSave1).then(function (picUrlResult) {
            fileName1 = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName1);
        });
    }
    else
        fileName1 = "nopic.jpg";


    mySqlServer.query("update tablekyc set Name=?,contactno=?,Address=?,City=?,Gender=?,DOB=?,Qualification=?,Occupation=?,info=?,picpath=?,idpath=? where Email=? ", [inputname, inputnumber, inputAddress, inputCity, gen, inputdob, inputqual, inputoccu, inputoth, fileName, fileName1, inputEmail4], function (err) {
        if (err == null) { resp.send("Record Update Successsfulllyyy.. Badhaiiii"); }

        else
            resp.send(err.message);
    })
})

app.get("/fetch", function (req, resp) {
    mySqlServer.query("select * from tablekyc where Email=?", [req.query.Email], function (err, resultAry) {
        if (err != null)
            req.send(err.message);
        else
            resp.send(resultAry);
    })
})

app.get("/cp", function (req, resp) {
    let pathname3 = __dirname + "/public/client.html";
    resp.sendFile(pathname3);
})

app.post("/cprofile", async function (req, resp) {
    let inputclientid = req.body.inputclientid;
    let inputname = req.body.inputname;
    let inputbusi = req.body.inputbusi;
    let inputbusiprof = req.body.inputbusiprof;
    let inputaddress = req.body.inputaddress;
    let inputcity = req.body.inputcity;
    let inputphone = req.body.inputphone;
    let inputid = req.body.inputid;
    let inputidnum = req.body.inputidnum;
    let inputoth = req.body.inputoth;

    mySqlServer.query("insert into tablecprofile values(?,?,?,?,?,?,?,?,?,?)", [inputclientid, inputname, inputbusi, inputbusiprof, inputaddress, inputcity, inputphone, inputid, inputidnum, inputoth], function (err) {
        if (err == null) {
            resp.send("Record Saved");
        }
        else
            resp.send(err.message);
    })
});



app.post("/update-client", async function (req, resp) {
    let inputclientid = req.body.inputclientid;
    let inputname = req.body.inputname;
    let inputbusi = req.body.inputbusi;
    let inputbusiprof = req.body.inputbusiprof;
    let inputaddress = req.body.inputaddress;
    let inputcity = req.body.inputcity;
    let inputphone = req.body.inputphone;
    let inputid = req.body.inputid;
    let inputidnum = req.body.inputidnum;
    let inputoth = req.body.inputoth;

    mySqlServer.query("update  tablecprofile set Name=?,Business=?,Businessproof=?,Address=?,City=?,Phone_number=?,ID=?,ID_number=?,info=? where Clientid=?", [inputname, inputbusi, inputbusiprof, inputaddress, inputcity, inputphone, inputid, inputidnum, inputoth, inputclientid], function (err) {
        if (err == null) {
            resp.send("Record Updated");
        }
        else
            resp.send(err.message);
    })
});





app.get("/fetch-client", function (req, resp) {
    mySqlServer.query("select * from tablecprofile where Clientid=?", [req.query.Email], function (err, resultAry) {
        if (err != null)
            req.send(err.message);
        else
            resp.send(resultAry);
    })
})



app.get("/postjobs", function (req, resp) {
    let pathname = __dirname + "/public/post-jobs.html";
    resp.sendFile(pathname);
})

app.post("/postjob", function(req,resp){
    let inputclientid=req.body.inputclientid;
    let inputjobtitle=req.body.inputjobtitle;
    let inputjt=req.body.inputjt;
    let inputaddress=req.body.inputaddress;
    let inputcity=req.body.inputcity;
    let inputer=req.body.inputer;
    let inputcp=req.body.inputcp;
    let inputoth=req.body.inputoth;
 
    mySqlServer.query("insert into jobs values(?,?,?,?,?,?,?,?,?)",[null,inputclientid,inputjobtitle,inputjt,inputaddress,inputcity,inputer,inputcp,inputoth],function(err)
     {
             if(err==null)
             {
                 resp.send("Record Saved");
             }
             else
             resp.send(err.message);
     })
 
 })

app.get("/vol-dash", function (req, resp) {
    let pathname4 = __dirname + "/public/vol-dash.html";
    resp.sendFile(pathname4);
})

app.get("/client-dash", function (req, resp) {
    let pathname4 = __dirname + "/public/client-dash.html";
    resp.sendFile(pathname4);
})

app.get("/admin-dash", function (req, resp) {
    let pathname5 = __dirname + "/public/admin.html";
    resp.sendFile(pathname5);
})

app.get("/vc", function (req, resp) {
    let pathname6 = __dirname + "/public/volunteer_control.html";
    resp.sendFile(pathname6);
})


app.get("/vcontrol", function (req, resp) {

    mySqlServer.query("select * from tablekyc", function (err, jsonaarray) {
        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);
    })

})



app.get("/cc", function (req, resp) {
    let pathname7 = __dirname + "/public/client_control.html";
    resp.sendFile(pathname7);
})


app.get("/ccontrol", function (req, resp) {

    mySqlServer.query("select * from tablecprofile", [], function (err, jsonaarray) {
        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);
    })

})

app.get("/uc", function (req, resp) {
    let pathname8 = __dirname + "/public/usercontrol.html";
    resp.sendFile(pathname8);
})


app.get("/usercontrol", function (req, resp) {

    mySqlServer.query("select * from users", [], function (err, jsonaarray) {
        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);
    })

})

app.get("/resume", function (req, resp) {
    mySqlServer.query("update users set status=1 where email=?", [req.query.email], function (err, jsonaarray) {

        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);

    }



    )


})
app.get("/block", function (req, resp) {
    mySqlServer.query("update users set status=0 where email=?", [req.query.email], function (err, jsonaarray) {

        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);

    }



    )


})
app.get("/jm", function (req, resp) {
    let pathname9 = __dirname + "/public/Job_Manager.html";
    resp.sendFile(pathname9);
})


app.get("/jobmanager", function (req, resp) {

    mySqlServer.query("select * from jobs", [], function (err, jsonaarray) {
        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);
    })

})

app.get("/dofetch1", function (req, resp) {
    mySqlServer.query("select * from jobs where cid=?", [req.query.email], function (err, jsonaarray) {

        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);

    }



    )
})


app.get("/delete", function (req, resp) {
    mySqlServer.query("select * from jobs where cid=?", [req.query.email], function (err, jsonaarray) {

        if (err == null) {
            resp.send(jsonaarray);
        }
        else
            resp.send(err.message);

    }



    )
})

// Search Button FindWork API
app.get("/Fetch-City", function(req,resp){
    mySqlServer.query("SELECT DISTINCT city from jobs ", [], function(err,jsonarray){
        if (err==null)
            {
                resp.send(jsonarray);
            }
            else{
                resp.send(err.message);
            }

    })

})

app.get("/Fetch-JT", function(req,resp){
    mySqlServer.query("SELECT DISTINCT jobtitile from jobs ", [], function(err,jsonarray){
        if (err==null)
            {
                resp.send(jsonarray);
            }
            else{
                resp.send(err.message);
            }

    })

})

app.get("/FetchAllJobs", function(req,resp){
    mySqlServer.query("SELECT * FROM jobs WHERE city = ? AND jobtitile = ?;", [req.query.city, req.query.jobtitile], function(err,jsonarray){
        if (err==null)
            {
                resp.send(jsonarray);
            }
            else{
                resp.send(err.message);
            }

    })

})


app.get("/fw", function (req, resp) {
    let pathname9 = __dirname + "/public/Find-work.html";
    resp.sendFile(pathname9);
})









