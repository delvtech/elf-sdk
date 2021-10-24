"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenInfo = exports.initTokenInfo = void 0;
var lodash_keyby_1 = __importDefault(require("lodash.keyby"));
/**
 * Init the tokenlist for given chain
 * @param chainName name of the chain that the tokenlist represents
 * @returns mapping of TokenInfos by address
 */
function initTokenInfo(chainName) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var tokenListJson = require("elf-tokenlist/dist/" + chainName + ".tokenlist.json");
    var tokenInfos = tokenListJson.tokens;
    var tokenInfoByAddress = (0, lodash_keyby_1.default)(tokenInfos, "address");
    return tokenInfoByAddress;
}
exports.initTokenInfo = initTokenInfo;
/**
 * Helper function for looking up a tokenlist info
 * @param address address of the token
 * @param tokenInfoByAddress mapping of TokenInfos by address
 * @returns Mapping of TokenInfos by address
 */
function getTokenInfo(address, tokenInfoByAddress) {
    return tokenInfoByAddress[address];
}
exports.getTokenInfo = getTokenInfo;
