import {sendGridEmailValidation} from 'api/util';

export const validateEmail = email => {
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // return re.test(String(email).toLowerCase());

  // another validator anystring@anystring.anystring
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const validatePhoneNumber = phoneNumber => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phoneNumber.replace(/\s/g,''));
}

export const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};


export async function checkValidEmail(email) {
  try {
    const response = await sendGridEmailValidation(email);
    const {
      additional,
      domain,
      verdict,
      score,
    } = (((response || {}).data || {}).result || {}).checks || {};
    const {
      has_known_bounces,
      has_suspected_bounces
    } = additional || {};
    const {
      has_mx_or_a_record,
      has_valid_address_syntax,
      is_suspected_disposable_address
    } = domain || {};

    // const acceptsMarketing = has_mx_or_a_record && has_valid_address_syntax && !has_known_bounces;
    const validSyntaxRecord = has_mx_or_a_record && has_valid_address_syntax;

    return {
      acceptsMarketing: true,
      validSyntaxRecord
    };
  } catch (err) {

    return {
      acceptsMarketing: true,
      validSyntaxRecord: true // TODO: always true for now: NOTE: sendgridKey is not working.
    }
  }
}