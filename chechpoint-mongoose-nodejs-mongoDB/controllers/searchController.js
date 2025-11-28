import Person from "../models/Person.js";

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function (err, people) {
    if (err) return console.error(err);
    done(null, people);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function (err, person) {
    if (err) return console.error(err);
    done(null, person);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function (err, person) {
    if (err) return console.error(err);
    done(null, person);
  });
};

// Chain Search Query Helpers to Narrow Search Results
const queryChain = (done) => {
  // Find people who like burritos, sort by name, limit to 2, hide age field
  Person.find({ favoriteFoods: "burritos" })
    .sort({ name: 1 })
    .limit(2)
    .select("-age")
    .exec(function (err, data) {
      if (err) return console.error(err);
      done(null, data);
    });
};

export { findPeopleByName, findOneByFood, findPersonById, queryChain };
