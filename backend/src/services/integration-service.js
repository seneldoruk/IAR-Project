const crxservice = require("./open-crx-service");
const hrmservice = require("./orange-hrm-service");
const evaluationsservice = require("./mongo-evaluations-service");
const returnAllRequired = async (year = -1) => {
  var allInfo = await crxservice.ordersGroupedBySalesman(year);
  allInfo = crxservice.calculateOrderSums(allInfo);
  const evaluations = await evaluationsservice.getEvaluations(year);
  for (const salesman of allInfo) {
    salesman.id = await hrmservice.findHRMContactandRetrieveValues(
      salesman.name
    );
    salesman.evaluations = evaluations.find((s) => s.id == salesman.id);
    salesman.totalBonus =
      salesman.evaluations.evaluationBonus + salesman.salesBonus;
  }
  return allInfo;
};

module.exports.cacheRequiredInfo = async (collection) => {
  console.log(`Caching started ${new Date().toLocaleString()}`);
  await collection;
  const allInfo = await returnAllRequired(2022);
  console.log("Deleting the current table");
  collection.deleteMany({});
  collection.insertMany(allInfo);
  console.log(`Cached in: ${new Date().toLocaleString()}`);
};
