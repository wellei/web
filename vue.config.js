const express = require("express");

var app = express();
//  拿到jsin数据
var sellData = require("./data/data.json")

var seller = sellData.seller;
var goods = sellData.goods;
var ratings = sellData.ratings;


module.exports = {
    devServer: {
        host: "localhost",
        port: "8088",
        before(app){
            app.get("/api/seller", (req, res) => {
                res.json({
                    errno: 0,
                    seller: seller
                })
            })
            //  goods
            app.get("/api/goods", (req, res) => {
                res.json({
                    errno: 0,
                    goods: goods
                })
            })
            // tatings
            app.get("/api/ratings", (req, res) => {
                res.json({
                    errno: 0,
                    ratings: ratings
                })
            })
        }
    }
}