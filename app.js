//jshint esversion:6
const mongoose=require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path =require("path");
const _=require("lodash");
let items=[];

mongoose.set('strictQuery', true);

const app = express();
mongoose.connect("mongodb+srv://Admin-Ahmad:Ahmadkhan123@todolist.jdorhwa.mongodb.net/todolistDB",{useNewUrlParser:true})
const itemSchema={
  itemName:String
};
const item= mongoose.model("item",itemSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const workItems = [];
const item1=new item({
  itemName:"welcome to your todolist!"
});
const item2=new item({
  itemName:"Hit + button to add a new item"
});
const item3=new item({
  itemName:"<-- hit this to delete an item"
});
 defaultItems=[item1,item2,item3];
 const listSchema={
  name:String,
  items:[itemSchema]
 };
 const List = mongoose.model("List",listSchema);

app.get("/",(req,res)=>{
  item.find({},(err,foundItems)=>{
       
       if (foundItems.length ===0 ){
        item.insertMany(defaultItems,(err)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully added all the items");
          res.redirect("/");
        }
        })}
        else{
          res.render("list",{listTitle:"Today",newListItems:foundItems});
        } 
  })
})
app.post("/", function(req, res){ 

  const data = req.body.newItem;
  const listName = req.body.list;
   const Item= new item({
    itemName:data
   });
   if(listName==="Today"){
    Item.save();
      res.redirect("/");
   }
   else
   {List.findOne({name:listName},(err,foundList)=>{
    foundList.items.push(Item);
    foundList.save();
    res.redirect("/" + listName);
   })}
  
});
app.get("/:customListName",(req,res)=>{
  const  customListName = _.capitalize(req.params.customListName);  
  List.findOne({name:customListName},(err,foundList)=>{
    if(!err)
    {
    if(!foundList)
    {
        const list =List({
        name:customListName,
        items: defaultItems
      });
           
      list.save();
      res.redirect("/" + customListName);
      
    }
    else
    {
      res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
    }
  }
  else 
  console.log(err);
})
  
}
);



app.listen(3000, function() {
  console.log("Server started on port 3000");
  
});
app.post("/delete",(req,res)=>{
  const checkedItemId = req.body.deleteItem;

  const listName =req.body.listName;
  if (listName === "Today")
{ 
  item.deleteOne({_id:checkedItemId},(err)=>{
    if(err)
    console.log(err);
    else
    res.redirect("/");
  });
}

  else {
    
    List.findOneAndUpdate({name: listName}, 
      {$pull: {items: {_id: checkedItemId}}}, 
      function(err){
      if (!err)
        res.redirect("/" + listName);
      
    });
  }});

