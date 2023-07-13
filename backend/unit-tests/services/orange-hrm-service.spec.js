const service = require("../../src/services/orange-hrm-service");
const chai = require("chai");
const sinon = require("sinon");
var expect = chai.expect;
it("Testing getting id by full name", async () => {
  const fake = sinon.replace(
    service,
    "getAllEmployees",
    sinon.fake(() => {
      const allEmployees = {
        data: [
          { fullName: "Doruk Senel", employeeId: 3 },
          { fullName: "Max Mustermann", employeeId: 2 },
        ],
      };
      return allEmployees;
    })
  );
  expect(await service.findHRMContactandRetrieveValues("Doruk Senel")).to.equal(
    3
  );
});
