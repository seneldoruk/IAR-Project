const axios = require("axios");
const qs = require("qs");
var FormData = require("form-data");
const { get } = require("./user-service");
const baseurl = "https://sepp-hrm.inf.h-brs.de/symfony/web/index.php";

const getToken = async () => {
  var data = new FormData();
  data.append("client_id", "api_oauth_id");
  data.append("client_secret", "oauth_secret");
  data.append("grant_type", "password");
  data.append("username", "senel123");
  data.append("password", "*Safb02da42Demo$");

  var config = {
    method: "post",
    url: `${baseurl}/oauth/issueToken`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  return await axios(config)
    .then(function (response) {
      return response.data.access_token;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const storeBonusSalary = async (id, year, value) => {
  const token = await getToken();
  year = year === -1 ? 2022 : year;
  var data = qs.stringify({
    year: year,
    value: value,
  });
  var config = {
    method: "post",
    url: `${baseurl}/api/v1/employee/${id}/bonussalary`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getAllEmployees = async () => {
  const token = await getToken();
  var config = {
    method: "get",
    url: "https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const findHRMContactandRetrieveValues = async (fullName) => {
  const allEmployees = await module.exports.getAllEmployees();
  const employee = allEmployees["data"].find(
    (employee) => employee.fullName === fullName
  );
  return employee.employeeId;
};
module.exports = {
  getToken,
  storeBonusSalary,
  getAllEmployees,
  findHRMContactandRetrieveValues,
};
