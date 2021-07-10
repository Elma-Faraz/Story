const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");// require mongoose
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb+srv://admin-Elma:test12345@cluster0.srhtr.mongodb.net/todolistDB", { useNewUrlParser: true });// connected mongoose with mongodb and the port 27017

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //it allows to apply css mentiined in css folder


app.set("view engine", "ejs"); //set view engine for ejs before use 

//make schema for the database
const itemSchema = {
  name: String
};

//model for collection of database
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({ name: "Enter your list items" });
const item2 = new Item({ name: "add new item on clicking add button" });
const item3 = new Item({ name: "Delete items by clicking on checkbox" });

const defaultItems = [item1, item2, item3];

//new schema for different pages like work,home,etc
const listSchema = {
  name: String,
  item: [itemSchema]
};

//new model for different pages like home,work,etc
const List = mongoose.model("List", listSchema);


// request to upload our homepage
app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log("there is some error. Please check your  coneection");
        } else {
          console.log("inserted sucessfully");
        }
      });
      res.redirect("/");
    }
    else {
      res.render("list", { listTitle: "Today", Newitem: foundItems });  //to show the changes made in the html in ejs file we need to render it like this 
    }
  });
});

//to conect to different list like work, home, etc
app.get("/:customListName", function (req, res) {
  const customListItem = _.capitalize(req.params.customListName);
  List.findOne({ name: customListItem }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //create new list
        const listItem = new List({
          name: customListItem,
          item: defaultItems
        });
        listItem.save();
        res.redirect("/" + customListItem);
      }
      else {
        //show existing list
        res.render("list", { listTitle: foundList.name, Newitem: foundList.item });
      }
    }
  })

});


//to 
app.post("/", function (req, res) {
  //to add new item in the list
  const newItem = req.body.newItem;
  const listName = req.body.list;
  //to make the items in work to add in same page not in home page. 
  const itemName = new Item({ name: newItem });
  if (listName === "Today") {
    itemName.save();
    res.redirect("/");
  }
  else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.item.push(itemName);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//to delete an item from the list when click checkbox instead of cutting it
app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItem, function (err) {
      if (err) {
        console.log("there is some error");
      }
      else {
        res.redirect("/");
      }
    });
  }  
  else {
        List.findOneAndUpdate({ name: listName }, { $pull: { item: { id: checkedItem } } }, function (err, foundList) {
          if (!err) {
            res.redirect("/" + listName);
          }
        });
      }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("your server is connected succesfully");
});