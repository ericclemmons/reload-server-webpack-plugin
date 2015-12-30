import expect from "expect";
import imported from "..";

const Plugin = require("../build/ReloadServerPlugin");
const required = require("..");

describe("ReloadServerPlugin", function() {
  it("should be import-able", function() {
    expect(imported).toEqual(Plugin);
  });

  it("should be require-able", function() {
    expect(required).toEqual(Plugin);
  });
});
