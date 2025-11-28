import Person from "../models/Person.js";

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function (err, removedPerson) {
    if (err) return console.error(err);
    done(null, removedPerson);
  });
};

const removeManyPeople = (done) => {
  Person.deleteMany({ name: "Mary" }, function (err, result) {
    if (err) return console.error(err);
    done(null, result);
  });
};

export { removeById, removeManyPeople };
