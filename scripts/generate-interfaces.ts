/*
 * Copyright 2021 Element Finance, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as https from "https";
import JsonToTS from "json-to-ts";
import * as fs from "fs";

// this url should point to either a goerli.json or a mainnet.json.
// ideally, they would both be checked against a schema to ensure they are the same
let url =
  "https://raw.githubusercontent.com/element-fi/elf-deploy/main/addresses/goerli.json";
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
