import { isNan } from "./isNan";
import { isCommaSeparatedListWithNoEmptyElements } from "./isCommaSeparatedListWithNoEmptyElements";
import { isIPv4 } from "./isIPv4";
import { isIPv4WithPrefix } from "./isIPv4WithPrefix";
import { isIPv6 } from "./isIPv6";
import { isIPv6WithPrefix } from "./isIPv6WithPrefix";
import { isPort } from "./isPort";
import { isPortOrWildcard } from "./isPortOrWildcard";
import { isWithinRange } from "./isWithinRange";
import { testRegex } from "./testRegex";
import { testPattern } from "./testPattern";
import { testMaxSize } from "./testMaxSize";
import { testMinSize } from "./testMinSize";
import { validateAllGroupsFlag_No } from "./validateAllGroupsFlag_No";
import { validateAllGroupsFlag_Yes } from "./validateAllGroupsFlag_Yes";
import { isLimit } from "./isLimit";
import { isNotEmpty } from "./isNotEmpty";
import { batchValidator } from "./batchValidator";
import { isIPv4WithPrefixOrWildcard } from "./isIPv4WithPrefixOrWildcard";
const ValidationHelper = {
  isNan,
  isWithinRange,
  isNotEmpty,
  testPattern,
  isLimit,
  testRegex,
  testMinSize,
  testMaxSize,
  isIPv4: isIPv4,
  isIPv4WithPrefix,
  isIPv6,
  isIPv6WithPrefix,
  isPort,
  isPortOrWildcard,
  validateAllGroupsFlag_Yes,
  validateAllGroupsFlag_No,
  isCommaSeparatedListWithNoEmptyElements,
  isIPv4WithPrefixOrWildcard,
  batchValidator,
};

export default ValidationHelper;

// const $ = {
//   isIPv4,
//   isIPv6,
//   isWithinRange,
//   batchValidator,
//   isNotEmpty,
//   isLimit,
//   validateAllGroupsFlag_Yes,
//   validateAllGroupsFlag_No,
// };
