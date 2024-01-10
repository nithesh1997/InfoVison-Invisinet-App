import { blurHandler } from "../handle/blurHandler";
import { changeHandler } from "../handle/changeHandler";
import { clearHandler } from "../handle/clearHandler";
import { focusHandler } from "../handle/focusHandler";
import { hoverEnterHandler } from "../handle/hoverEnterHandler";
import { hoverLeaveHandler } from "../handle/hoverLeaveHandler";
import { okHandler } from "../handle/okHandler";
import { resetHandler } from "../handle/resetHandler";
import { submitHandler } from "../handle/submitHandler";
import { validationHandler } from "../handle/validationHandler";

export const initialInputHandlerState = {
  onHoverEnter: hoverEnterHandler,
  onHoverLeave: hoverLeaveHandler,
  onFocus: focusHandler,
  onBlur: blurHandler,
  onChange: changeHandler,
  onSubmit: submitHandler,
  onReset: resetHandler,
  onClear: clearHandler,
  onOk: okHandler,
  onValidation: validationHandler,
};
