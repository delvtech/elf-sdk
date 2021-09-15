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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcFixedAPR = void 0;
var time_1 = require("../../src/constants/time");
function calcFixedAPR(spotPrice, secondsUntilMaturity) {
    if (secondsUntilMaturity > 0) {
        var timeRemaining = secondsUntilMaturity / time_1.ONE_YEAR_IN_SECONDS;
        return ((1 - spotPrice) / timeRemaining) * 100;
    }
    else {
        return 0;
    }
}
exports.calcFixedAPR = calcFixedAPR;
