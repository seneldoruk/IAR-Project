var axios = require("axios");
var FormData = require("form-data");
const auth = { username: "guest", password: "guest" };
const orangehmrservice = require("./orange-hrm-service");
const mongodbservice = require("./mongo-evaluations-service");

const getAllContancts = async () => {
  var data = new FormData();
  var config = {
    method: "get",
    url: "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account",
    auth: auth,
    headers: {
      "Content-Type": "application/json",
      ...data.getHeaders(),
    },
    data: data,
  };

  return await axios(config)
    .then(function (response) {
      return response.data.objects.map((object) => {
        var name;
        if (object.fullName.includes(",")) {
          const nameArr = object.fullName.split(",");
          name = nameArr[1].trim() + " " + nameArr[0].trim();
        } else {
          name = object.fullName;
        }
        return {
          name: name,
          rating: object.accountRating,
          href: object["@href"],
        };
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};
const getAllOrders = async () => {
  var config = {
    method: "get",
    url: "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder",
    auth: auth,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await axios(config)
    .then(function (response) {
      return response.data.objects;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getProductsFromOrder = async (order) => {
  const positionLink = order["@href"] + "/position";
  const position = await axios
    .get(positionLink, {
      auth: auth,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.data);
  if (position["@total"] === "0" || !position.objects) return null;
  const products = await Promise.all(
    position.objects.map(async (product) => {
      const productref = await axios
        .get(product.product["@href"], {
          auth: auth,
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => res.data);
      return {
        name: productref.name,
        href: productref["@href"],
        quantity: product.quantity,
        customerhref: order.customer["@href"],
      };
    })
  );
  return products;
};

const ordersGroupedBySalesman = async (year = -1) => {
  var allOrders = await getAllOrders();
  if (year != -1) {
    allOrders = allOrders.filter((order) =>
      order.createdAt.includes(year.toString())
    );
  }
  const allContacts = await getAllContancts();
  const salesmenHrefs = Array.from(
    new Set(allOrders.map((order) => order.salesRep["@href"]))
  );
  var arr = [];
  for (let href of salesmenHrefs) {
    const salesman = allContacts.find((contact) => contact.href === href);
    const orders = allOrders.filter(
      (order) => order.salesRep["@href"] === href
    );
    salesman.orders = await Promise.all(
      orders.map((order) => getProductsFromOrder(order))
    );
    salesman.orders = salesman.orders.filter((order) => order !== null);
    arr.push(salesman);
  }

  for (let salesman of arr) {
    for (let order of salesman.orders) {
      for (let product of order) {
        customer = allContacts.find(
          (contact) => contact.href === product.customerhref
        );
        product.customerName = customer.name;
        product.customerRating = customer.rating;
      }
    }
  }
  return arr;
};

const calculateOrderSums = (ordersGroupedBySalesman) => {
  const weights = { HooverClean: 1, HooverGo: 2 };
  for (let salesman of ordersGroupedBySalesman) {
    var sum = 0;
    for (order of salesman.orders) {
      for (product of order) {
        product.bonus =
          product.customerRating *
          parseInt(product.quantity, 10) *
          weights[product.name];
        sum += product.bonus;
      }
    }
    salesman.salesBonus = sum;
  }
  return ordersGroupedBySalesman;
};

module.exports = {
  getAllContancts,
  getAllOrders,
  ordersGroupedBySalesman,
  getProductsFromOrder,
  calculateOrderSums,
};
