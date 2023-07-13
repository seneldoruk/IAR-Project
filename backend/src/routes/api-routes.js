const express = require("express");
const router = express.Router();
const { checkAuthorization } = require("../middlewares/auth-middleware");

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require("../apis/auth-api"); //api-endpoints are loaded from separate files
router.post("/login", authApi.login); //the function decides which request type should be accepted
router.delete("/login", checkAuthorization(), authApi.logout); //middlewares can be defined in parameters
router.get("/login", authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require("../apis/user-api");
router.get("/user", checkAuthorization(), userApi.getSelf);

const peopleDemoApi = require("../apis/people-demo-api");
router.get("/people", checkAuthorization(), peopleDemoApi.getPeople);

const salespeopleapi = require("../apis/salespeopleapi");
router.get("/salespeople", checkAuthorization(), async (req, res) => {
  const db = req.app.get("db");
  const user = req.session.user;
  const roleIsSalesman = user.role === "salesman";
  const hrmservice = require("../services/orange-hrm-service");
  const query = roleIsSalesman
    ? { name: `${user.firstname} ${user.lastname}` }
    : {};
  var salesmanRemarks;
  if (roleIsSalesman) {
    const id = await hrmservice.findHRMContactandRetrieveValues(query.name);
    console.log(id);
    const remarks = await db
      .collection("remarks")
      .find({
        id: parseInt(id),
      })
      .toArray();
    if (remarks.length === 0) {
      res.send([]);
      return;
    }
    salesmanRemarks = remarks;
  }
  db.collection("caching")
    .find(query)
    .toArray()
    .then((data) => {
      if (roleIsSalesman) {
        data[0].remarks = salesmanRemarks[0].remarks;
      }
      res.send(data);
    });
});
router.post("/salespeople", (req, res) => {
  const user = req.session.user;
  if (!user.role || user.role !== "ceo") {
    res.send(401);
    return;
  }

  const db = req.app.get("db");
  const hrmservice = require("../services/orange-hrm-service");
  db.collection("caching")
    .find(query)
    .toArray()
    .then((data) => {
      for (let salesman of data) {
        hrmservice.storeBonusSalary(salesman.id, 2022, salesman.totalBonus);
      }
    });
});
router.post("/bonus", checkAuthorization(), (req, res) => {
  const user = req.session.user;
  if (user.role !== "ceo") res.send(401);
  const db = req.app.get("db");
  const { id, remarks, value } = req.body;
  if (!id || !value) return res.sendStatus(400);
  if (!remarks) remarks = "";
  var year = -1;
  if (req.body.year) year = req.body.year;
  const hrmservice = require("../services/orange-hrm-service");
  const mongoservice = require("../services/mongo-evaluations-service");
  hrmservice.storeBonusSalary(id, year, value).then(() => {
    mongoservice.storeRemarks(remarks, id, db, year).then(() => {
      res.send({ status: 200 });
    });
  });
});
router.get("/bonus", checkAuthorization(), async (req, res) => {
  const user = req.session.user;
  if (user.role !== "ceo") res.send(401);
  const db = req.app.get("db");
  const remarkedUserIds = await db
    .collection("remarks")
    .find()
    .toArray()
    .then((data) => data.map((remark) => remark.id.toString()));
  const usersWithoutRemarks = await db
    .collection("caching")
    .find({ id: { $nin: remarkedUserIds } })
    .toArray();
  res.send(
    usersWithoutRemarks.map((user) => {
      return { name: user.name, id: user.id, calculatedBonus: user.totalBonus };
    })
  );
});
module.exports = router;
