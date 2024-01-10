import { mount } from "enzyme";
import SignIn from "./SignIn";

describe("SignIN", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<SignIn />);
  });
  it("check if login controls rendered", () => {
    const identity = wrapper.find("#identity").first();
    const password = wrapper.find("#password").first();
    expect(identity).toHaveLength(1);
    expect(password).toHaveLength(1);
  });

  it("check if the Login button is disabled on load", () => {
    const loginButton = wrapper.find("#loginbutton").first();
    expect(loginButton.props().disabled).toBe("true");
  });

  it("check with Invalid password", () => {
    const identity = wrapper.find("#identity").first();
    const password = wrapper.find("#password").first();

    identity.simulate.change({ target: { value: "test" } });
    password.simulate.change({ target: { value: "test" } });

    const loginButton = wrapper.find("#loginbutton").first();
    //loginButton.simulate("click");
    expect(loginButton.props().disabled).toBe("false");
  });

  /*it("check if caps lock is on", () => {
    wrapper.find("#password").at(0).simulate("keydown", { keyCode: 20 });

    expect(wrapper.contains("Caps Lock is On !!")).toEqual(true);
  });*/
});
