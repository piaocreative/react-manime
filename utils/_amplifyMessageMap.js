/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import { I18n } from '@aws-amplify/core';
import constants from '../constants';

const MapEntries = [
  [constants.messages.USER_NOT_EXIST, /user.*not.*exist/i],
  [constants.messages.USER_ALREADY_EXIST, /user.*already.*exist/i],
  [constants.messages.INCORRECT_USERNAME_PASSWORD, /incorrect.*username.*password/i],
  [constants.messages.VALIDATION_PASSWORD, /validation.*password/i],
  [
    constants.messages.INVALID_PHONE,
    /invalid.*phone/i,
    constants.messages.INVALID_PHONE_FORMAT
  ]
];

const AmplifyMessageMap = message => {
  const match = MapEntries.filter(entry => entry[1].test(message));
  if (match.length === 0) {
    return message;
  }

  const entry = match[0];
  const msg = entry.length > 2 ? entry[2] : entry[0];

  return I18n.get(entry[0], msg);
};

export default AmplifyMessageMap;
