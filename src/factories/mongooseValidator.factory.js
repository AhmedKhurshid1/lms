// Validators for mongoose

/** 
 * Returns a factory for retreiving exams by status
 * @returns {Function} Validator - A mongoose validator for empty string if left blank or an exact text match
*/
const EmptyStringOrExactMatch = (string) => {
  string = string || '';
  return {
    validator: function (v) {
      if (value === string) return true;
    },
    message: props => `${props.value} empty`
  }
}

module.exports = {
  EmptyStringOrExactMatch
}