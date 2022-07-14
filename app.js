var express =require("express");
var path =require("path");
const passport =require("passport");
const cookieparser =require("cookie-parser");
const session=require("express-session");
var app=express();
app.use(express.static(path.join(__dirname,"/public/")));
const bodyparser=require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieparser());
app.use(session({secret:'NodeApp'}));
require("./src/config/passport.js")(app);
app.use("/css/",express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")));
app.use("/js/",express.static(path.join(__dirname,"node_modules/bootstrap/dist/js")));
app.use("/js/",express.static(path.join(__dirname,"node_modules/jquery/dist")));
app.set("views","./src/views");
app.set("view engine","ejs");

const ProductRoutes=require("./src/Routes/ProductRouters");
app.use("/product",ProductRoutes);

const UserRoutes=require("./src/Routes/UserRouters");
app.use("/User",UserRoutes);

const AdminRoutes=require("./src/Routes/AdminRouters ");
const { json } = require("body-parser");
app.use("/Admin",AdminRoutes);

app.get("/",(req,res)=>{
    res.redirect("/product");
})
app.listen(3000,()=>{
    console.log("listining now on port 3000");
})
