const calculateEvaluations = (evaluationsList) => {
  const criterias = [
    "openness",
    "leadership",
    "social",
    "attitude",
    "communication",
    "integrity",
  ];
  const bonusForValue = {
    5: 100,
    4: 50,
    3: 20,
    2: 10,
    1: 0,
  };
  for (let evaluation of evaluationsList) {
    let total = 0;
    for (let criteria of criterias) {
      evaluation[criteria] = {
        value: evaluation[criteria],
        bonus: bonusForValue[evaluation[criteria]],
      };
      total += evaluation[criteria].bonus;
    }
    evaluation.evaluationBonus = total;
  }
  return evaluationsList;
};
module.exports = {
  getEvaluations: async (year = -1) => {
    const { MongoClient } = require("mongodb");
    const connectionurl =
      "mongodb://team_14:team_14!@iar-mongo.inf.h-brs.de:27017/?authSource=team_14";
    return await MongoClient.connect(connectionurl).then(async (dbo) => {
      const db = dbo.db("team_14");
      const evaluations = db.collection("evaluations");
      const query = year === -1 ? {} : { year: year };
      var res = await evaluations.find(query).toArray();
      res = calculateEvaluations(res);
      dbo.close();
      return res;
    });
  },
  storeRemarks: async (remarks, id, db, year = -1) => {
    year = year == -1 ? 2022 : year;
    await db.collection("remarks").insertOne({ remarks: remarks, id: id });
  },
};
