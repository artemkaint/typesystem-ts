import ps= require("./actualParse")
import ts = require("../src/typesystem")
import chai = require("chai");
import assert = chai.assert;

describe("Min max facets validation",function() {
    it("validating si", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]"
        })
        assert.isTrue(tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks confluent", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            minItems:3,
            maxItems:2
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks negative min max", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            minItems:-1
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks min max positive", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            minItems:1
        })
        var st=tp.validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating checks min max has correct type", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            minItems:"1"
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks min max has correct type", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            minItems:1.2
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks negative max", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            maxItems:-1
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  max positive", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            maxItems:1
        })
        var st=tp.validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating checks  max has correct type", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            maxItems:"1"
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  max has correct type", function () {
        var tp = ps.parseJSON("Person", {
            type: "string[]",
            maxItems:1.2
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  min length", function () {
        var tp = ps.parseJSON("Person", {
            type: "string",
            minLength:1.2
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  min length", function () {
        var tp = ps.parseJSON("Person", {
            type: "string",
            minLength:1
        })
        assert.isTrue(tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  max length", function () {
        var tp = ps.parseJSON("Person", {
            type: "string",
            maxLength:1.2
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  max length", function () {
        var tp = ps.parseJSON("Person", {
            type: "string",
            maxLength:1
        })
        assert.isTrue(tp.validateType(ts.builtInRegistry()).isOk());
    });

    //min max properties
    it("validating checks  min properties", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            minProperties:1.2
        })
        var s=tp.validateType(ts.builtInRegistry());

        assert.isTrue(!s.isOk());
    });
    it("validating checks  min properties 2", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            minProperties: 1
        })
        assert.isTrue(tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  max properties", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            minProperties:1.2
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  max properties", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            minProperties:1
        })
        assert.isTrue(tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating checks  max min properties", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            minProperties:3,
            maxProperties:1
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });

    it("validating minimum", function () {
        var tp = ps.parseJSON("Person", {
            type: "number",
            minimum: -1
        })
        var st=tp.validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating maximum", function () {
        var tp = ps.parseJSON("Person", {
            type: "number",
            maximum:{}
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating min/max", function () {
        var tp = ps.parseJSON("Person", {
            type: "number",
            maximum:-1,
            minimum:1
        })
        assert.isTrue(!tp.validateType(ts.builtInRegistry()).isOk());
    });
    it("validating min/max 2", function () {
        var tp = ps.parseJSON("Person", {
            type: "number",
            maximum:4,
            minimum:1
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
})
describe("Other simple facet validation",function() {
    it("validating enum", function () {
        var tp = ps.parseJSON("Person", {
            type: "number",
            enum: [0,1,2]
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating enum 1", function () {
        var tp = ps.parseJSON("Person", {
            type: "number",
            enum: [0,1,1]
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating pattern", function () {
        var tp = ps.parseJSON("Person", {
            type: "string",
            pattern: "\\"
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating pattern positive", function () {
        var tp = ps.parseJSON("Person", {
            type: "string",
            pattern: "."
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
});
describe("Type hierarchy validation",function() {
    it("validating - recurrent type", function () {
        var tp = ps.parseJSON("Person", {
            type: "Person"
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validation - unknown type", function () {
        var tp = ps.parseJSON("Person222", {
            type: "Person"
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validation - incorrect type", function () {
        var tp = ps.parseJSON("Person222", {
            type: "Person["
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validation - strange inheritance", function () {
        var tp = ps.parseJSON("Person222", {
            type: "Person["
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
});
describe("Metadata validation",function() {
    it("validating - discriminator", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            discriminator: "kind"
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - discriminator 2", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            discriminator: "kind",
            properties:{
                kind: "string"
            }
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - discriminator 3", function () {
        var tp = ps.parseJSON("Person", {
            type: "object",
            discriminator: "kind",
            properties:{
                kind: "array"
            }
        })
        var st= tp.validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - discriminator 4", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                Person:{
                    type: "object",
                    properties:{
                        kind: "string"
                    }
                },
                Man: {
                    type: "Person",
                    discriminator: "kind"
                }
            }
        })
        var st= tp.getType("Man").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - discriminator value", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                Person:{
                    type: "object",
                    properties:{
                        kind: "string"
                    }
                },
                Man: {
                    type: "Person",
                    discriminator: "kind",
                    discriminatorValue: "Person"
                }
            }
        })
        var st= tp.getType("Man").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - discriminator value 2", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                Person:{
                    type: "object",
                    properties:{
                        kind: "string"
                    }
                },
                Man: {
                    type: "Person",
                    discriminatorValue: "Person"
                }
            }
        })
        var st= tp.getType("Man").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - discriminator value 3", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                Person:{
                    type: "object",
                    discriminator: "kind",
                    properties:{
                        kind: "string"
                    }
                },
                Man: {
                    type: "Person",
                    discriminatorValue: 3
                }
            }
        })
        var st= tp.getType("Man").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - default", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number",
                    default: 4
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - default 2", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number",
                    default: "4"
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - example", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number",
                    example: 4
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - example 2", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number",
                    example: "4"
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - example 2", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number",
                    example: "4"
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - multiple example 1", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number",
                    examples: {
                        a:{
                            content: 4
                        },
                        b:{
                            content: 5
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - multiple example 2", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number",
                    examples: {
                        a:{
                            content: "4"
                        },
                        b:{
                            content: 5
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - multiple example 2.1", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number| integer",
                    examples: {
                        a:{
                            content: "4"
                        },
                        b:{
                            content: 5
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });

    it("validating - multiple example 2.3", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "number| integer",
                    examples: {
                        a:{
                            content: 4.2
                        },
                        b:{
                            content: 5
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - multiple example 3", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    examples: {
                        a:{
                            content: {
                                x: 3,
                                y: 2
                            }
                        },
                        b:{
                            content: {
                                x: 3,
                                y: 4
                            }
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - multiple example 4", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    examples: {
                        a:{
                            content: {
                                x: 3,
                                y2: 2
                            }
                        },
                        b:{
                            content: {
                                x: 3,
                                y: 4
                            }
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - multiple example 5", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    examples: {
                        a:{
                            content: `{
                                "x": 3,
                                "y": 2
                            }`
                        },
                        b:{
                            content: `{
                                "x": 3,
                                "y": 4
                            }`
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - multiple example 6", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    examples: {
                        a:{
                            content: `<MyNumber><x>2</x><y>3</y></MyNumber>`
                        }
                    }
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - unknown facet", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    exampls: 2
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - facet positive", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    facets: {
                        "tp?": "number"
                    }
                },
                MyNumber2:{
                    type: "MyNumber",
                    tp: 2
                }

            }
        });
        var st= tp.getType("MyNumber2").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - facet wrong type", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    facets: {
                        "tp?": "number"
                    }
                },
                MyNumber2:{
                    type: "MyNumber",
                    tp: "3"
                }

            }
        })
        var st= tp.getType("MyNumber2").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - optional facets", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    facets: {
                        "tp?": "number"
                    }
                },
                MyNumber2:{
                    type: "MyNumber",

                }

            }
        })
        var st= tp.getType("MyNumber2").validateType(ts.builtInRegistry());
        assert.isTrue(st.isOk());
    });
    it("validating - facet override", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    facets: {
                        "tp?": "number"
                    }
                },
                MyNumber2:{
                    type: "MyNumber",
                    facets: {
                        "tp": "number"
                    }
                }

            }
        })
        var st= tp.getType("MyNumber2").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - redeclare builtin", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    facets: {
                        "discriminator": "number"
                    }
                },


            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("validating - incorrect facet name", function () {
        var tp = ps.parseJSONTypeCollection({
            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    },
                    facets: {
                        "(discriminator)": "number"
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(ts.builtInRegistry());
        assert.isTrue(!st.isOk());
    });
    it("annotations validation 0", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "string"
            },
            types: {
                MyNumber:{
                    "(Label)": "Hello",
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it("annotations validation 1", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "string"
            },
            types: {
                MyNumber:{
                    "(Label2)": "Hello",
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    });
    it("annotations validation 3", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "number"
            },
            types: {
                MyNumber:{
                    "(Label)": "Hello",
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    });
    it("annotations validation 4", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "number"
            },
            types: {
                MyNumber:{
                    "(Label)": 4,
                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it("annotations validation 5", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "number"
            },
            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        x:
                        {
                            type: "number",
                            "(Label)":"3"
                        },
                        y: "number",
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    });
    it("annotations validation 6", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "number"
            },
            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        x:
                        {
                            type: "number",
                            "(Label)": 3
                        },
                        y: "number",
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it("annotations validation 7", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "number"
            },
            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        "[x]":
                        {
                            type: "number[]",
                            "(Label)": "3"
                        },
                        y: "number",
                    }
                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    });
    it("annotations validation 8", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "number"
            },
            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        "[x]":
                        {
                            type: "number[]",
                            examples:{
                                a:{
                                    "(Label)": "3",
                                    content: [1,2]
                                }
                            }
                        },
                        y: "number",
                    }

                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    });
    it("annotations validation 9", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes:{
                Label: "number"
            },
            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        "[x]":
                        {
                            type: "number[]",
                            examples:{
                                a:{
                                    "(Label)": 3,
                                    content: [1,2]
                                }
                            }
                        },
                        y: "number",
                    }

                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
});

describe("Type family related validation",function() {
    it ("test that type is suitable for ac",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
                MyNumber2:{

                    type: "MyNumber",
                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 2",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
                MyNumber2:{

                    type: "MyNumber",
                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 3",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
                MyNumber2:{

                    type: "MyNumber",
                    properties:{
                        x2: "number",
                        y2: "number",
                    }

                },
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 4",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    type: "object",
                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
                MyNumber2:{

                    type: "MyNumber",
                    properties:{
                        x2: "number",
                        y2: "number",
                    }

                },
                MyNumber3:{

                    type: "MyNumber",
                    properties:{
                        x2: "number",
                        y2: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 5",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    type: "polymorphic",
                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
                MyNumber2:{

                    type: "MyNumber",
                    properties:{
                        "x2?": "number",
                        "y2?": "number",
                    }

                },
                MyNumber3:{

                    type: "MyNumber",
                    properties:{
                        x3: "number",
                        y3: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    });
    it ("test that type is suitable for ac 6",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    properties:{
                        x: "number",
                        y: "number",
                    }

                },
                MyNumber2:{

                    type: "MyNumber",
                    properties:{
                        "x2": "number",
                        "y2?": "number",
                    }

                },
                MyNumber3:{

                    type: "MyNumber",
                    properties:{
                        x3: "number",
                        y3: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 7",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    discriminator: "kind",
                    properties:{
                        x: "number",
                        y: "number",
                        kind: "string"
                    }

                },
                MyNumber2:{

                    type: "MyNumber",
                    properties:{
                        "x2?": "number",
                        "y2?": "number",
                    }

                },
                MyNumber3:{

                    type: "MyNumber",
                    properties:{
                        x3: "number",
                        y3: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 8",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    discriminator: "kind",
                    discriminatorValue: "d",
                    properties:{
                        x: "number",
                        y: "number",
                        kind: "string"
                    }

                },
                MyNumber2:{
                    discriminatorValue: "d",
                    type: "MyNumber",
                    properties:{
                        "x2?": "number",
                        "y2?": "number",
                    }

                },
                MyNumber3:{

                    type: "MyNumber",
                    properties:{
                        x3: "number",
                        y3: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 9",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{

                    abstract:"true",
                    discriminator: "kind",
                    discriminatorValue: "d",
                    properties:{
                        x: "number",
                        y: "number",
                        kind: "string"
                    }

                },
                MyNumber2:{
                    discriminatorValue: "d",
                    type: "MyNumber",
                    properties:{
                        "x2?": "number",
                        "y2?": "number",
                    }

                },
                MyNumber3:{

                    type: "MyNumber",
                    properties:{
                        x3: "number",
                        y3: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 10",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber2 | MyNumber3",
                MyNumber2:{
                    type: "object",
                    properties:{
                        "x2": "number",
                        "y2?": "number",
                    }

                },
                MyNumber3:{

                    type: "object",
                    properties:{
                        x3: "number",
                        y3: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 11",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber2 | MyNumber3",
                MyNumber2:{
                    type: "object",
                    discriminator: "l",
                    properties:{
                        "x2?": "number",
                        "y2?": "number",
                        l: "string"
                    }

                },
                MyNumber3:{
                    discriminator: "l",
                    type: "object",
                    properties:{
                        l: "string",
                        x3: "number",
                        y3: "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 12",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber2 | MyNumber3",
                MyNumber2:{
                    type: "object",
                    properties:{
                        "x2?": "number",
                        "y2?": "number",
                        l: "string"
                    }

                },
                MyNumber3:{
                    discriminator: "l",
                    type: "object",
                    properties:{
                        l: "string",
                        "x3?": "number",
                        "y3?": "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 13",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber2 | MyNumber3",
                MyNumber2:{
                    type: "object",
                    discriminator: "l",
                    properties:{
                        "x2?": "number",
                        "y2?": "number",
                        l: "string"
                    }

                },
                MyNumber3:{
                    discriminator: "l",
                    type: "object",
                    properties:{
                        l: "string",
                        "x3?": "number",
                        "y3?": "number",
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 14",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber2 | MyNumber3",
                MyNumber2:{
                    type: "object",
                    properties:{
                        "x2": "number",
                    }

                },
                MyNumber3:{
                    type: "object",
                    properties:{
                        "x2": "string"
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });
    it ("test that type is suitable for ac 15",function(){
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber2 | MyNumber3",
                MyNumber2:{
                    type: "object",
                    properties:{
                        "x2": "MyNumber2[]",
                    }

                },
                MyNumber3:{
                    type: "object",
                    properties:{
                        "x2": "MyNumber3[]"
                    }

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    });

});
describe("Type hierarchy related",function(){
    it("type recursion 1",function(){

            var tp = ps.parseJSONTypeCollection({

                types: {
                    MyNumber: "MyNumber3",

                    MyNumber3:{
                        type: "MyNumber",


                    }
                }
            })
            var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
            assert.isTrue(!st.isOk());

    })
    it("type recursion arras",function(){

        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber3[]",

                MyNumber3:{
                    type: "MyNumber[]",


                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());

    })
    it("type recursion 2",function(){

        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber3",

                MyNumber3:{
                    type: "MyNumber| MyNumber 3",
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());

    })

    it("type recursion 3",function(){

        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "MyNumber3| MyNumber",

            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());

    })
})
describe("Type validation basics",function() {
    it("unknown type in property", function () {
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        "x2": "Hello",
                    }

                }

            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    })
    it("unknown type in union", function () {
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{
                    type: "object",
                    properties:{
                        "x2": "Hello| number",
                    }

                }

            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    })
    it("basic conflicts are validated", function () {
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber:{type: "number", minimum: 3, maximum: 1}

            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    })
    it("type components are checked for unknown types 1", function () {
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: "string2[]"

            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    })
    it("annotation types validation", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes: {
                a: "string"
            },
            types: {
                MyNumber: {
                    type: "string",
                    "(a)": "r"
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    })
    it("annotation types validation", function () {
        var tp = ps.parseJSONTypeCollection({
            annotationTypes: {
                a: "string"
            },
            types: {
                MyNumber: {
                    type: "string",
                    "(a1)": "r"
                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
    })
    it("array types validation", function () {
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: {
                    type: "string2[]",

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(!st.isOk());
        var tp = ps.parseJSONTypeCollection({

            types: {
                MyNumber: {
                    type: "string[]",

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    })
    it("schemas", function () {
        var tp = ps.parseJSONTypeCollection({

            schemas: {
                MyNumber: {
                    type: "string[]",

                }
            }
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    })
    it("schemas 1", function () {
        var tp = ps.parseJSONTypeCollection({

            schemas: [
                {
                    MyNumber: {
                        type: "string[]",

                    }
                }
                ]
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    })
    it("schemas 2", function () {
        var tp = ps.parseJSONTypeCollection({

            schemas: [
                {
                    MyNumber: null
                }
            ]
        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    })
    it("schemas 3", function () {
        var tp = ps.parseJSONTypeCollection({

            schemas:
                {
                    Z: null,
                    MyNumber: "Z"
                }

        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    })
    it("schemas 4", function () {
        var tp = ps.parseJSONTypeCollection({

            schemas:
            [
                {Z: null},
                {MyNumber: "Z"}
            ]

        })
        var st= tp.getType("MyNumber").validateType(tp.getAnnotationTypeRegistry());
        assert.isTrue(st.isOk());
    })
    it("validate optionals", function () {
        var tp = ps.parseJSONTypeCollection({

            schemas:{
                Hello:{
                    type: "object",
                    properties:{
                        "zz?" :"number"
                    }
                },
                LLLL:
                {
                    type: "Hello[]"

                }
            }

        })
        var st= tp.getType("LLLL").validate([{}]);
        assert.isTrue(st.isOk());
    })
    it("validate optionals2", function () {
        var tp = ps.parseJSONTypeCollection({

            schemas:{
                Hello:{
                    type: "object",
                    properties:{
                        "zz" :"number"
                    }
                },
                LLLL:
                {
                    type: "Hello[]"

                }
            }

        })
        var st= tp.getType("LLLL").validate([{}]);
        assert.isTrue(!st.isOk());
    })

})
