export function batchValidator(tests) {
  let result = "";

  for (let i = 0; i < tests.length; i++) {
    let res = tests[i].runner(...tests[i].args);

    if (res === false) {
      result = tests[i].error;
      break;
    } else {
      result = tests[i].success;
    }
  }

  return result;
}
