const express= require("express");
const path = require('path');
const app= express();
const usermodel=require('./models/user');
const user = require("./models/user");
const { z } = require("zod");

app.set('view engine',"ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));
app.get("/",(req,res)=>{
    res.render("index")
})
const userSchema=z.object({
    name: z.string().min(3, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    image: z.string().url({ message: "Invalid image URL" })
})
app.post("/create", async (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body);
        let { name, email, image } = validatedData;
        let createduser = await usermodel.create({
            name,
            email,
            image
        });
        res.redirect("/read");
    } catch (error) {
        res.status(400).send(error.errors);
    }
});
app.get("/read", async(req,res)=>{
    let users= await usermodel.find();
    res.render("read",{users})
})
app.get("/edit/:id", async(req,res)=>{
    let user= await usermodel.findOne({_id:req.params.id});
    res.render("edit",{user})
})
app.post("/update/:id", async(req,res)=>{
    let {name,email,image}=req.body
    let user= await usermodel.findOneAndUpdate({_id:req.params.id},{name,email,image},{new:true});
    res.redirect("/read")
})
app.get("/delete/:id", async(req,res)=>{
    let users= await usermodel.findOneAndDelete({_id:req.params.id});
    res.redirect("/read")
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})