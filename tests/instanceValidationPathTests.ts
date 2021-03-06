import ps= require("./actualParse")
import ts = require("../src/typesystem")
import chai = require("chai");
import assert = chai.assert;

describe("Simple validation testing",function() {

    it("first level path", function () {
        var tp = ps.parseJSONTypeCollection({

            types:{
                a: {
                    "type": "object",
                    properties:{
                        z: "number"
                    }
                }
            }
        });
        var t=tp.getType("a");
        var st= t.validate({z:"a"});
        var f=false;
        assert.isTrue(st.getErrors().length===1);
        assert.isTrue(st.getErrors()[0].getValidationPath().name=="z");
    });
    it("second level path", function () {
        var tp = ps.parseJSONTypeCollection({

            types:{
                b:{
                    type:" object",
                    properties:{ y: "number"}
                },
                a: {
                    "type": "object",
                    properties:{
                        z: "b"
                    }
                }
            }
        });
        var t=tp.getType("a");
        var st= t.validate({z:{ y: "dd"}});
        var f=false;
        assert.isTrue(st.getErrors().length===1);
        assert.isTrue(st.getErrors()[0].getValidationPath().child.name=="y");
    });
    it("third level path", function () {
        var tp = ps.parseJSONTypeCollection({

            types:{
                b:{
                    type:" object",
                    properties:{ "y": "b","n?":"number"}
                },
                a: {
                    "type": "object",
                    properties:{
                        z: "b"
                    }
                }
            }
        });
        var t=tp.getType("a");
        var st= t.validate({z:{ y: {n:"z"}}});
        var f=false;
        assert.isTrue(st.getErrors().length===2);
        assert.isTrue(st.getErrors()[0].getValidationPath().child.name=="y");
        assert.isTrue(st.getErrors()[1].getValidationPath().child.child.name=="n");
    });
    it("multi path", function () {
        var tp = ps.parseJSONTypeCollection({

            types:{
                b:{
                    type:" object",
                    properties:{ "y": "b","n?":"number"}
                },
                a: {
                    "type": "object",
                    properties:{
                        z: "b"
                    }
                }
            }
        });
        var t=tp.getType("a");
        var st= t.validate({z:{ y: {n:"z"}}});
        var f=false;
        assert.isTrue(st.getErrors().length===2);
        assert.isTrue(st.getErrors()[0].getValidationPath().child.name=="y");
        assert.isTrue(st.getErrors()[1].getValidationPath().child.child.name=="n");
    });
    it("array path", function () {
        var tp = ps.parseJSONTypeCollection({

            types:{

                a: {
                    "type": "object",
                    properties:{
                        z: "number[]"
                    }
                }
            }
        });
        var t=tp.getType("a");
        var st= t.validate({z:[0,"1"]});
        var f=false;
        assert.isTrue(st.getErrors().length===1);
        assert.isTrue(st.getErrors()[0].getValidationPath().child.name=="1");
    });
    it("array path2 ", function () {
        var tp = ps.parseJSONTypeCollection({

            types:{

                a: {
                    "type": "object",
                    properties:{
                        z: "number[]"
                    }
                }
            }
        });
        var t=tp.getType("a");
        var st= t.validate({z:[0,"1"]});
        var f=false;
        assert.isTrue(st.getErrors().length===1);
        assert.equal(st.getErrors()[0].getValidationPathAsString(),"z/1");
    });
    it("unknown property path ", function () {
        var tp = ps.parseJSONTypeCollection({

            types:{
                z: {
                  type: "object",
                  properties:{
                      mm: "number"
                  }
                },
                a: {
                    "type": "object",
                    properties:{
                        z: "z"
                    }
                }
            }
        });
        var t=tp.getType("a");
        var st= t.validate({z:{ mm: 3, d: 1}});
        var f=false;
        assert.isTrue(st.getErrors().length===1);
        assert.equal(st.getErrors()[0].getValidationPathAsString(),"z/d");
    });
});