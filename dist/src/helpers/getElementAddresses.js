"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseTokenAddress = exports.getPoolIdByTermAddress = exports.getElementYtPoolAddresses = exports.getElementPtPoolAddresses = exports.getElementTermAddresses = exports.getElementTermFactoryAddresses = exports.getElementDeploymentAddresses = exports.PoolType = void 0;
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
var https = __importStar(require("https"));
var PoolType;
(function (PoolType) {
    PoolType[PoolType["PT"] = 0] = "PT";
    PoolType[PoolType["YT"] = 1] = "YT";
})(PoolType = exports.PoolType || (exports.PoolType = {}));
/**
 * Get the contract addresses deployed by Element
 * @param url The url of the json changelog file
 * @returns A Promise for the DeploymentAddresses object
 */
function getElementDeploymentAddresses(url) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            params = {
                host: new URL(url).hostname,
                method: "GET",
                path: new URL(url).pathname,
            };
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var req = https.request(params, function (res) {
                        var result;
                        if (res.statusCode < 200 || res.statusCode >= 300) {
                            return reject(new Error("statusCode=" + res.statusCode));
                        }
                        var body = [];
                        res.on("data", function (chunk) {
                            body.push(chunk);
                        });
                        res.on("end", function () {
                            try {
                                result = (JSON.parse(Buffer.concat(body).toString()));
                            }
                            catch (e) {
                                reject(e);
                            }
                            resolve(result);
                        });
                    });
                    req.on("error", function (err) {
                        reject(err);
                    });
                    req.end();
                })];
        });
    });
}
exports.getElementDeploymentAddresses = getElementDeploymentAddresses;
/**
 * Get TermFactory addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns the TermFactory used to deploy each individual term
 */
function getElementTermFactoryAddresses(deploymentAddresses) {
    // get TermFactories listed in each Term
    var termFactories = [];
    for (var trancheListKey in deploymentAddresses.tranches) {
        var trancheList = deploymentAddresses.tranches[trancheListKey];
        for (var _i = 0, trancheList_1 = trancheList; _i < trancheList_1.length; _i++) {
            var tranche = trancheList_1[_i];
            termFactories.push(tranche.trancheFactory);
        }
    }
    // remove dups
    return Array.from(new Set(termFactories));
}
exports.getElementTermFactoryAddresses = getElementTermFactoryAddresses;
/**
 * Get Element Term addresses
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of Term addresses
 */
function getElementTermAddresses(deploymentAddresses) {
    // get each Term
    var terms = [];
    for (var trancheListKey in deploymentAddresses.tranches) {
        var trancheList = deploymentAddresses.tranches[trancheListKey];
        for (var _i = 0, trancheList_2 = trancheList; _i < trancheList_2.length; _i++) {
            var tranche = trancheList_2[_i];
            terms.push(tranche.address);
        }
    }
    return terms;
}
exports.getElementTermAddresses = getElementTermAddresses;
/**
 * Get PtPool addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of PT Pool addresses
 */
function getElementPtPoolAddresses(deploymentAddresses) {
    // get PTPools listed in each Term
    var pools = [];
    for (var trancheListKey in deploymentAddresses.tranches) {
        var trancheList = deploymentAddresses.tranches[trancheListKey];
        for (var _i = 0, trancheList_3 = trancheList; _i < trancheList_3.length; _i++) {
            var tranche = trancheList_3[_i];
            pools.push(tranche.ptPool.address);
        }
    }
    return pools;
}
exports.getElementPtPoolAddresses = getElementPtPoolAddresses;
/**
 * Get PtPool addresses associated with each term
 * @param deploymentAddresses The DeploymentAddresses object
 * @returns An array of YT Pool addresses
 */
function getElementYtPoolAddresses(deploymentAddresses) {
    // get get YTPools listed in each Term
    var pools = [];
    for (var trancheListKey in deploymentAddresses.tranches) {
        var trancheList = deploymentAddresses.tranches[trancheListKey];
        for (var _i = 0, trancheList_4 = trancheList; _i < trancheList_4.length; _i++) {
            var tranche = trancheList_4[_i];
            pools.push(tranche.ytPool.address);
        }
    }
    return pools;
}
exports.getElementYtPoolAddresses = getElementYtPoolAddresses;
/**
 * Returns the PoolId from the DeploymentAddresses that matches a termAddress
 * @param termAddress termAddress to filter on
 * @param deploymentAddresses The DeploymentAddresses object
 * @param PoolType Either PT or YT
 * @returns a promise for a poolId
 */
function getPoolIdByTermAddress(termAddress, deploymentAddresses, poolType) {
    return __awaiter(this, void 0, void 0, function () {
        var poolId, trancheListKey, trancheList, _i, trancheList_5, tranche;
        return __generator(this, function (_a) {
            poolId = "";
            for (trancheListKey in deploymentAddresses.tranches) {
                trancheList = deploymentAddresses.tranches[trancheListKey];
                for (_i = 0, trancheList_5 = trancheList; _i < trancheList_5.length; _i++) {
                    tranche = trancheList_5[_i];
                    if (termAddress == tranche.address) {
                        if (poolType == PoolType.PT) {
                            poolId = tranche.ptPool.poolId;
                        }
                        else {
                            poolId = tranche.ytPool.poolId;
                        }
                    }
                }
            }
            return [2 /*return*/, poolId];
        });
    });
}
exports.getPoolIdByTermAddress = getPoolIdByTermAddress;
/**
 * Get base address for a given token
 * @param deploymentAddresses The Deployment Addresses object
 * @param tokenKey
 * @returns The base address
 */
function getBaseTokenAddress(deploymentAddresses, tokenKey) {
    for (var token in deploymentAddresses.tokens) {
        if (token == tokenKey) {
            return deploymentAddresses.tokens[token];
        }
    }
    return "";
}
exports.getBaseTokenAddress = getBaseTokenAddress;
