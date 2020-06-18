// Modals
const User = require("./../../models/Users");

export async function get(req, res, next) {
  // the `username` parameter is available because
  // this file is called [slug].json.js
  const { username } = req.params;

  // const response = await getRequest("/users", { username: username });

  User.findOne({ username: username }, (err, result) => {
    if (err) {
      // return res
      //   .status(500)
      //   .send({ message: "Something went wrong", type: "error" });
      return res.status(500).send({ message: `Something went wrong` });
      // return res.end(
      //   JSON.stringify({
      //     message: `Something went wrong`,
      //   })
      // );
    }

    if (result === null) {
      // return res.status(404).send({ message: "User not found", type: "error" });
      return res.status(404).send({ message: `Not found` });

      // return res.end(
      //   JSON.stringify({
      //     message: `Not found`,
      //   })
      // );
    }
    // res.send({ result, type: "success" });
    // res.writeHead(200, {
    //   "Content-Type": "application/json",
    // });

    return res.status(200).send({ result: result });
    // return res.end(
    //   JSON.stringify({
    //     result: result,
    //   })
    // );
  });

  // if (lookup.has(username)) {
  //   res.writeHead(200, {
  //     "Content-Type": "application/json",
  //   });

  //   res.end(lookup.get(username));
  // } else {
  //   res.writeHead(404, {
  //     "Content-Type": "application/json",
  //   });

  //   res.end(
  //     JSON.stringify({
  //       message: `Not found`,
  //     })
  //   );
  // }
}
