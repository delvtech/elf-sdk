import * as https from "https";
import JsonToTS from "json-to-ts";
import * as fs from "fs";

let url =
  "https://raw.githubusercontent.com/element-fi/elf-deploy/802c94e9c06a7c2d1f4985dd11a05e88681ed80e/addresses/goerli.json";
https
  .get(url, (res) => {
    let body = "";

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      try {
        let json = JSON.parse(body);
        fs.truncateSync("typechain/DeploymentAddresses.d.ts");
        JsonToTS(json, { rootName: "DeploymentAddresses" }).forEach(
          (typeInterface) => {
            fs.appendFileSync(
              "typechain/DeploymentAddresses.d.ts",
              "export ",
              "utf8"
            );
            fs.appendFileSync(
              "typechain/DeploymentAddresses.d.ts",
              typeInterface,
              "utf8"
            );
            fs.appendFileSync(
              "typechain/DeploymentAddresses.d.ts",
              "\n",
              "utf8"
            );
            console.log(typeInterface);
          }
        );
      } catch (error) {
        console.error(error.message);
      }
    });
  })
  .on("error", (error) => {
    console.error(error.message);
  });
