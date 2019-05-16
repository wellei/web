const express = require("express");

var app = express();
//  拿到jsin数据
var sellData = require("./data/data.json")

var  seller = sellData.seller;
var  goods = sellData.goods;
var  ratings = sellData.ratings;

//  seller
app.get("/api/seller",(req,res)=>{
    res.json({
        errno:0,
        data:seller
    })
})
//  goods
app.get("/api/goods",(req,res)=>{
    res.json({
        errno:0,
        data:goods
    })
})
// tatings
app.get("/api/ratings",(req,res)=>{
    res.json({
        errno:0,
        data:ratings
    })
})


app.listen(3030)
console.log("running on 3030")
