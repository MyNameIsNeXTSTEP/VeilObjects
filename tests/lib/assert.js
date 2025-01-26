var assert = console.assert;

export function assertMult(assertCasesArr = []) {
  assertCasesArr.forEach((assertCase) => {
    var { condition, data } = assertCase;
    assert(condition, data);
  });
};

export default assert;
