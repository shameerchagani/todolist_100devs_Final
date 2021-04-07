const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require("mongoose")
const TodoTask = require("./models/TodoTask")
const port = process.env.PORT || 6060

dotenv.config()

app.use("/public", express.static("public"))
app.use(express.urlencoded({extended: true}))

//connection to Database
mongoose.set("useFindAndModify", false)
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true , useUnifiedTopology: true }, () => {
console.log("Connected to db!")
app.listen(port, () => console.log("Server Up and running on port: " + port))
})

app.set("view engine", "ejs")

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });//End of get method.

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });

//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    addTask: req.body.addTask
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.send(err);
    }
    });

//UPDATE Method

app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { addTask: req.body.addTask }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});


//Server Configuration app.listen(port, () => console.log('server running on port: ' + port))