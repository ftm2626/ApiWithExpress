const Joi = require("joi");
const express = require("express");
const app = express();

//for useing body in request
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

//GET
//main route of the site
app.get("/", (req, res) => {
  res.send("hi");
});

//Route for getting courses
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//Route for getting one course
app.get("/api/courses/:id", (req, res) => {
  // res.send(req.params.id)
  const course = courses.find((i) => i.id === parseInt(req.params.id));
  if (!course) res.status(404).send("the course with the id was not found");
  else res.send(course.name);
});

//POST
app.post("/api/courses", (req, res) => {
  //manual input validation - use joi package instead
  // if (!req.body.name || req.body.name.length < 3) {
  //     //400 Bad Request
  //     res.status(400).send('name is required!')
  //     return;
  // }

  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }
  //because there is no DATABASE we send info manually
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

//put
app.put("/api/courses/:id", (req, res) => {
  //look up the course
  //if not exisiting, return 404
  const course = courses.find((i) => i.id === parseInt(req.params.id));
  if (!course) res.status(404).send("the course with the id was not found");

  //validate
  //if invalid, return 400 - bad request
  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  //update course
  //return the updated course
  course.name = req.body.name;
  res.send(course);
});

//Delete
app.delete("/api/courses/:id", (req, res) => {
  //look up the course
  //if not exisiting, return 404
  const course = courses.find((i) => i.id === parseInt(req.params.id));
    if (!course) res.status(404).send("the course with the id was not found");

    //delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    
    //show result
    res.send(course)
    
});

//hard code 3000 is just good for production not development
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port} ...`));
