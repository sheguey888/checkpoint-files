import Person from "../models/Person.js";

const findEditThenSave = (personId, done) => {
  Person.findById(personId, function (err, person) {
    if (err) return console.error(err);

    person.favoriteFoods.push("hamburger");

    person.save(function (err, updatedPerson) {
      if (err) return console.error(err);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true },
    function (err, updatedPerson) {
      if (err) return console.error(err);
      done(null, updatedPerson);
    }
  );
};

export { findEditThenSave, findAndUpdate };
