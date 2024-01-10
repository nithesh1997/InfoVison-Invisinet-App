import { shallow, mount } from "enzyme";
import Dashboard from "./Dashboard";

describe("Dashboard Controls", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Dashboard />);
  });
  it("check if Tokens Widget rendered", () => {
    const tokenList = wrapper.find("#dsh-sw-tokens-list").first();
    expect(tokenList).toHaveLength(1);
  });
});
