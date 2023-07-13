const orangehmrservice = require("../services/orange-hrm-service");
const opencrxservice = require("../services/open-crx-service");
const mongodbservice = require("../services/mongo-evaluations-service");
exports.getSalesPeople = function (req, res) {
  opencrxservice
    .returnAllRequired()
    .then((people) => {
      res.send(people);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
};
exports.getHRMContacts = (req, res) => {
  orangehmrservice
    .getAllEmployees()
    .then((people) => {
      res.send(people);
    })
    .catch((_) => {
      res.status(500).send();
    });
};
exports.getEvaluations = (req, res) => {
  mongodbservice
    .getEvaluations(2022)
    .then((evaluations) => {
      res.send(evaluations);
    })
    .catch((err) => console.log(err));
};
