require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs");

const app = express();
app.use(express.urlencoded({
    extended:true
}));

app.use(express.static("public"));

app.set("view engine", "ejs");


const mongoose = require("mongoose");


mongoose.connect( env.DBPATH , {useUnifiedTopology: true, useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item",  itemsSchema);


app.get("/", function(req,res){

    var today = new Date();
    var options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    var day  = today.toLocaleDateString("en-US", options);

    Item.find({},function(err,foundData){
        if(err)
            console.log(err);
        else
        {
                res.render('list',{
                    listTitle: day,
                    newitems: foundData
                });
        }
    });
})

app.get("/about", function(req, res){
    res.render("about")
})

app.post("/", function(req,res){
    var itemNew= req.body.task;
    const newitem = new Item({
        name: itemNew
    })
    newitem.save();
    res.redirect("/");
})

app.post("/delete", function(req, res){
    var itemtobeddeleted=req.body.delitem;
    Item.deleteOne({_id:itemtobeddeleted},function(err){
        console.log("Done!");
    })
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req,res){
    console.log("Server is running on PORT:3000!");
})