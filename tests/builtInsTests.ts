/// <reference path="../typings/main.d.ts" />


import chai = require("chai");
import ts=require("../src/typesystem")
import rs=require("../src/restrictions")
import ms=require("../src/metainfo")

import facetRegistry=require("../src/facetRegistry")
import typeExpressions=require("../src/typeExpressions")

import assert = chai.assert;
import {NothingRestriction} from "../src/typesystem";
import {MaxProperties} from "../src/restrictions";
import {MinProperties} from "../src/restrictions";
import {MaxLength} from "../src/restrictions";
import {MinLength} from "../src/restrictions";
import {Minimum} from "../src/restrictions";
import {Maximum} from "../src/restrictions";
import {HasProperty} from "../src/restrictions";
import {ComponentShouldBeOfType} from "../src/restrictions";
import {AdditionalPropertyIs} from "../src/restrictions";
import {MapPropertyIs} from "../src/restrictions";
import {TypeOfRestriction} from "../src/typesystem";
import {Enum} from "../src/restrictions";
import {Pattern} from "../src/restrictions";
import {MinItems} from "../src/restrictions";
import {MaxItems} from "../src/restrictions";
describe("Built-ins",function(){
    it ("built in types exist",function(){
        chai.assert(ts.ARRAY!=null)
        chai.assert(ts.ANY.allSubTypes().indexOf(ts.BOOLEAN)!=-1)
    });
    it ("built in type registry",function(){
        chai.assert(ts.builtInRegistry().get("boolean"))
        chai.assert(!ts.builtInRegistry().get("boo3lean"))
    });

    it ("cycles does not cause a problem",function(){
        var p=ts.OBJECT.inherit("Person");
        var friend= p.inherit("Friend");
        p.addSuper(friend);
        chai.assert(p.allSuperTypes().length==4);
    });
    it ("union gather options of other unions",function(){
        var t1=ts.union("numberOrString",[ts.NUMBER,ts.STRING]);
        var t2=ts.union("numberOrBoolean",[t1,ts.BOOLEAN]);
        var allopts=t2.allOptions();
        assert.equal(allopts.length,3);
    });
    it ("union gather options of other unions 2",function(){
        var t1=ts.union("numberOrString",[ts.NUMBER,ts.STRING]);
        var t2=ts.union("numberOrBoolean",[t1,ts.NUMBER]);
        var allopts=t2.allOptions();
        assert.equal(allopts.length,2);
    });
    it ("union gather options of other unions 2",function(){
        var t1=ts.intersect("numberOrString",[ts.NUMBER,ts.STRING]);
        var t2=ts.intersect("numberOrBoolean",[t1,ts.NUMBER]);
        var allopts=t2.allOptions();
        assert.equal(allopts.length,2);
    });
    it ("simple check direct",function(){
        assert.isTrue(!ts.NOTHING.validate(2).isOk());
        assert.isTrue(ts.NOTHING.validate(null).isOk());
    });
    it ("hierarchy test",function(){
        var mi=ts.derive("integer",[ts.NUMBER])
        var mi3=ts.derive("myinteger",[mi])
        assert.equal(ts.NUMBER.allSubTypes().length,1);
        assert.equal(mi.allSubTypes().length,1);
        assert.equal(mi3.allSuperTypes().length,4);
    });
    it ("number check direct",function(){
        var mi=ts.derive("integer",[ts.NUMBER])
        var mi3=ts.derive("myinteger",[mi])
        assert.isTrue(mi3.validateDirect(4).isOk());
        assert.isTrue(!mi3.validateDirect("d").isOk());
    });
    it ("union check direct",function(){
        var mi=ts.union("numberOrString",[ts.NUMBER,ts.STRING])
        assert.isTrue(mi.validateDirect(4).isOk());
        assert.isTrue(mi.validateDirect("d").isOk());
        assert.isFalse(mi.validateDirect(false).isOk());
    });
    it ("intersection check direct",function(){
        var mi=ts.intersect("scalarAndString",[ts.SCALAR,ts.STRING])
        assert.isTrue(!mi.validateDirect(4).isOk());
        assert.isTrue(mi.validateDirect("d").isOk());
        assert.isFalse(mi.validateDirect(false).isOk());
    });
    it ("integer restrictions",function(){
        assert.isTrue(ts.INTEGER.validateDirect(5).isOk());
        assert.isTrue(!ts.INTEGER.validateDirect(5.2).isOk());
        assert.isTrue(!ts.INTEGER.validateDirect("3").isOk());
    });
    it ("object restrictions",function(){
        var p=ts.derive("Person",[ts.OBJECT]);
        assert.isTrue(p.validateDirect({}).isOk());
        assert.isTrue(!p.validateDirect([]).isOk());
        assert.isTrue(!p.validateDirect("").isOk());
    });
    it ("array restrictions",function(){
        var p=ts.derive("Person",[ts.ARRAY]);
        assert.isTrue(!p.validateDirect({}).isOk());
        assert.isTrue(p.validateDirect([]).isOk());
        assert.isTrue(!p.validateDirect("").isOk());
    });
});
describe("Simple instanceof tests",function() {
    it("declareProperty of correct type", function () {
       var person= ts.deriveObjectType("Person");
       person.declareProperty("name",ts.STRING,false);
       person.declareProperty("age",ts.NUMBER,true);
       var st=person.validateDirect({ name:"Pavel"});
       assert.isTrue(st.isOk());
    });
    it("declareProperty of incorrect type", function () {
        var person= ts.deriveObjectType("Person");
        person.declareProperty("name",ts.STRING,false);
        person.declareProperty("age",ts.NUMBER,true);
        var st=person.validateDirect({ name: 2});
        assert.isTrue(!st.isOk());
    });
    it("properties can be closed", function () {
        var person= ts.deriveObjectType("Person");
        person.declareProperty("name",ts.STRING,false);
        person.declareProperty("age",ts.NUMBER,true);
        person.closeUnknownProperties();
        var st=person.validateDirect({ name: "Pavel", d: "j3"});
        assert.isTrue(!st.isOk());
    });
    it("properties are closed positive", function () {
        var person= ts.deriveObjectType("Person");
        person.declareProperty("name",ts.STRING,false);
        person.declareProperty("age",ts.NUMBER,true);
        person.closeUnknownProperties();
        var st=person.validateDirect({ name: "Pavel"});
        assert.isTrue(st.isOk());
    });
    it("properties min properties", function () {
        var person= ts.deriveObjectType("Person");
        person.declareProperty("name",ts.STRING,false);
        person.declareProperty("age",ts.NUMBER,true);
        person.addMeta(new rs.MinProperties(2))
        person.closeUnknownProperties();
        var st=person.validateDirect({ name: "Pavel"});
        assert.isTrue(!st.isOk());
    });

    it("properties min properties 2", function () {
        var person= ts.deriveObjectType("Person");
        person.declareProperty("name",ts.STRING,false);
        person.declareProperty("age",ts.NUMBER,true);
        person.addMeta(new rs.MinProperties(2))
        person.closeUnknownProperties();
        var st=person.validateDirect({ name: "Pavel",age: 2});
        assert.isTrue(st.isOk());
    })
    it("properties max properties", function () {
        var person= ts.deriveObjectType("Person");
        person.declareProperty("name",ts.STRING,false);
        person.declareProperty("age",ts.NUMBER,true);
        person.addMeta(new rs.MaxProperties(1))
        person.closeUnknownProperties();
        var st=person.validateDirect({ name: "Pavel",age: 2});
        assert.isTrue(!st.isOk());
    });

    it("properties max properties 2", function () {
        var person= ts.deriveObjectType("Person");
        person.declareProperty("name",ts.STRING,false);
        person.declareProperty("age",ts.NUMBER,true);
        person.addMeta(new rs.MaxProperties(2))
        person.closeUnknownProperties();
        var st=person.validateDirect({ name: "Pavel",age: 2});
        assert.isTrue(st.isOk());
    })

    it("properties max items", function () {
        var person= ts.derive("Person",[ts.ARRAY]);
        person.addMeta(new rs.MaxItems(1))
        var st=person.validateDirect([2,1]);
        assert.isTrue(!st.isOk());
    });
    it("properties max items 2", function () {
        var person= ts.derive("Person",[ts.ARRAY]);
        person.addMeta(new rs.MaxItems(1))
        var st=person.validateDirect([1]);
        assert.isTrue(st.isOk());
    });
    it("properties min items", function () {
        var person= ts.derive("Person",[ts.ARRAY]);
        person.addMeta(new rs.MinItems(1))
        var st=person.validateDirect([]);
        assert.isTrue(!st.isOk());
    });
    it("properties min items 2", function () {
        var person= ts.derive("Person",[ts.ARRAY]);
        person.addMeta(new rs.MinItems(1))
        var st=person.validateDirect([1]);
        assert.isTrue(st.isOk());
    });
    it("properties min length", function () {
        var person= ts.derive("Person",[ts.STRING]);
        person.addMeta(new rs.MinLength(1))
        var st=person.validateDirect("");
        assert.isTrue(!st.isOk());
    });
    it("properties min length 2", function () {
        var person= ts.derive("Person",[ts.STRING]);
        person.addMeta(new rs.MinItems(1))
        var st=person.validateDirect("a");
        assert.isTrue(st.isOk());
    });
    it("properties max length", function () {
        var person= ts.derive("Person",[ts.STRING]);
        person.addMeta(new rs.MaxLength(1))
        var st=person.validateDirect("");
        assert.isTrue(st.isOk());
    });
    it("properties max length 2", function () {
        var person= ts.derive("Person",[ts.STRING]);
        person.addMeta(new rs.MaxLength(1))
        var st=person.validateDirect("aa");
        assert.isTrue(!st.isOk());
    });
    it("properties maximum", function () {
        var person= ts.derive("Person",[ts.NUMBER]);
        person.addMeta(new rs.Maximum(1))
        var st=person.validateDirect(0);
        assert.isTrue(st.isOk());
    });
    it("properties maximum 2", function () {
        var person= ts.derive("Person",[ts.NUMBER]);
        person.addMeta(new rs.Maximum(1))
        var st=person.validateDirect(2);
        assert.isTrue(!st.isOk());
    });
    it("properties minumum", function () {
        var person= ts.derive("Person",[ts.NUMBER]);
        person.addMeta(new rs.Minimum(0))
        var st=person.validateDirect(0);
        assert.isTrue(st.isOk());
    });
    it("properties minumum 2", function () {
        var person= ts.derive("Person",[ts.NUMBER]);
        person.addMeta(new rs.Minimum(4))
        var st=person.validateDirect(2);
        assert.isTrue(!st.isOk());
    });
    it("unique items", function () {
        var person= ts.derive("Person",[ts.ARRAY]);
        person.addMeta(new rs.UniqueItems(true))
        var st=person.validateDirect([2,2]);
        assert.isTrue(!st.isOk());
    });
    it("unique items 2", function () {
        var person= ts.derive("Person",[ts.ARRAY]);
        person.addMeta(new rs.UniqueItems(false))
        var st=person.validateDirect([2,3]);
        assert.isTrue(st.isOk());
    });
    it("pattern", function () {
        var person= ts.derive("Person",[ts.STRING]);
        person.addMeta(new rs.Pattern("^.$"))
        var st=person.validateDirect("a");
        assert.isTrue(st.isOk());
    });
    it("pattern 2", function () {
        var person= ts.derive("Person",[ts.STRING]);
        person.addMeta(new rs.Pattern("^.$"))
        var st=person.validateDirect("as");
        assert.isTrue(!st.isOk());
    });
    it ("map property", function(){
        var person= ts.derive("Person",[ts.STRING]);
        person.declareProperty("name",ts.STRING,false);
        person.declareMapProperty(".",ts.NUMBER);
        var st=person.validateDirect({name: "Pavel",d:"dd"});
        assert.isTrue(!st.isOk());
    });
    it ("map property 2", function(){
        var person= ts.derive("Person",[ts.STRING]);
        person.declareProperty("name",ts.STRING,true);
        person.declareMapProperty(".",ts.NUMBER);
        var st=person.validateDirect({d:4});
        assert.isTrue(!st.isOk());
    });
    it ("component should be of type",function(){
        var arr=ts.derive("ints",[ts.ARRAY]);
        arr.addMeta(new rs.ComponentShouldBeOfType(ts.NUMBER));
        var s=arr.validateDirect([3,4])
        assert.isTrue(s.isOk());
    });
    it ("component should be of type 2",function(){
        var arr=ts.derive("ints",[ts.ARRAY]);
        arr.addMeta(new rs.ComponentShouldBeOfType(ts.NUMBER));
        var s=arr.validateDirect([3,"DD"])
        assert.isTrue(!s.isOk());
    });
    it ("enum",function(){
        var arr=ts.derive("ints",[ts.STRING]);
        arr.addMeta(new rs.Enum(["a","b"]));
        var s=arr.validateDirect("c")
        assert.isTrue(!s.isOk());
    });
    it ("enum 2",function(){
        var arr=ts.derive("ints",[ts.STRING]);
        arr.addMeta(new rs.Enum(["a","b"]));
        var s=arr.validateDirect("a")
        assert.isTrue(s.isOk());
    });
    it ("additional property",function(){
        var arr=ts.derive("ints",[ts.OBJECT]);
        arr.addMeta(new rs.AdditionalPropertyIs(ts.INTEGER));
        var s=arr.validateDirect({ z:2})
        assert.isTrue(s.isOk());
    });
    it ("additional property 2",function(){
        var arr=ts.derive("ints",[ts.OBJECT]);
        arr.addMeta(new rs.AdditionalPropertyIs(ts.INTEGER));
        var s=arr.validateDirect({ z:"V"})
        assert.isTrue(!s.isOk());
    });
    it ("additional property 3",function(){
        var arr=ts.derive("ints",[ts.OBJECT]);
        arr.declareProperty("z",ts.STRING,true)
        arr.addMeta(new rs.AdditionalPropertyIs(ts.INTEGER));
        var s=arr.validateDirect({ z:"V"})
        assert.isTrue(s.isOk());
    });
    it ("additional property 4",function(){
        var arr=ts.derive("ints",[ts.OBJECT]);
        arr.declareMapProperty(".",ts.STRING)
        arr.addMeta(new rs.AdditionalPropertyIs(ts.INTEGER));
        var s=arr.validateDirect({ z:"V"})
        assert.isTrue(s.isOk());
    });
    it ("additional property +map",function(){
        var arr=ts.derive("ints",[ts.OBJECT]);
        arr.declareMapProperty("..",ts.STRING)
        arr.addMeta(new rs.AdditionalPropertyIs(ts.INTEGER));
        var s=arr.validateDirect({ z:"V"})
        assert.isTrue(!s.isOk());
    });

})
function assertLength(e:number,restr:ts.Constraint[]){
    var newRestr=rs.optimize(restr);
    assert.equal(newRestr.length,e);
}
function assertNothing(restr:ts.Constraint[]){
    var newRestr=rs.optimize(restr);
    assert.equal(newRestr.length,1);
    assert.isTrue(newRestr[0] instanceof  NothingRestriction);
}
describe("Composition", function(){
    it ("min max composition",function(){
        assertLength(1,[new rs.UniqueItems(true),new rs.UniqueItems(true)])
        assertLength(2,[new rs.UniqueItems(true),new rs.MinItems(1)])
    })
    it ("property is 1",function(){
        assertLength(1, [new rs.PropertyIs("a",ts.SCALAR), new rs.PropertyIs("a",ts.NUMBER)]);
        assertLength(1, [new rs.PropertyIs("a",ts.NUMBER), new rs.PropertyIs("a",ts.SCALAR)]);
        var p1=ts.deriveObjectType("Person");
        var p2=ts.deriveObjectType("Person");
        assertLength(1, [new rs.PropertyIs("a",p1), new rs.PropertyIs("a",p2)]);
        assertNothing([new rs.PropertyIs("a",ts.NUMBER), new rs.PropertyIs("a",ts.BOOLEAN)]);

    })
    it ("max properties composition",function(){
        assertNothing([new MaxProperties(2),new MinProperties(3)])
        assertLength(1,[new MaxProperties(3),new MaxProperties(2)]);
        assertLength(1,[new MaxProperties(2),new MaxProperties(3)]);
        assertLength(2,[new MaxProperties(6),new MinProperties(3)]);
    })
    it ("max length composition",function(){
        assertNothing([new MaxLength(4),new MinLength(6)])
        assertLength(1,[new MaxLength(3),new MaxLength(2)]);
        assertLength(1,[new MaxLength(2),new MaxLength(3)]);
        assertLength(2,[new MaxLength(6),new MinProperties(3)]);
    })
    it ("minimum composition",function(){
        assertNothing([new Minimum(5),new Maximum(2)])
        assertLength(1,[new Minimum(3),new Minimum(2)]);
        assertLength(1,[new Minimum(2),new Minimum(3)]);
        assertLength(2,[new Minimum(6),new MinProperties(3)]);
    })
    it ("maximum",function(){
        assertNothing([new Maximum(1),new Minimum(5)])
        assertLength(1,[new Maximum(3),new Maximum(2)]);
        assertLength(1,[new Maximum(2),new Maximum(3)]);
        assertLength(2,[new Maximum(6),new MinProperties(3)]);
    })
    it ("has property",function(){
        assertLength(1,[new HasProperty("n"),new HasProperty("n")]);
        assertLength(2,[new HasProperty("n"),new HasProperty("N")]);
    })
    it ("component should be of type",function(){
        assertLength(1,[new ComponentShouldBeOfType(ts.SCALAR),new ComponentShouldBeOfType(ts.NUMBER)]);
        assertLength(1,[new ComponentShouldBeOfType(ts.NUMBER),new ComponentShouldBeOfType(ts.SCALAR)]);
        assertLength(2,[new ComponentShouldBeOfType(ts.NUMBER),new Minimum(2)]);
        var p1=ts.deriveObjectType("Person");
        var p2=ts.deriveObjectType("Person");
        assertLength(1, [new ComponentShouldBeOfType(p1), new ComponentShouldBeOfType(p2)]);
        assertNothing([new ComponentShouldBeOfType(ts.NUMBER), new ComponentShouldBeOfType(ts.BOOLEAN)]);
    })
    it ("additional property test",function(){
        assertLength(1,[new AdditionalPropertyIs(ts.SCALAR),new AdditionalPropertyIs(ts.NUMBER)]);
        assertLength(1,[new AdditionalPropertyIs(ts.NUMBER),new AdditionalPropertyIs(ts.SCALAR)]);
        assertLength(2,[new AdditionalPropertyIs(ts.NUMBER),new Minimum(2)]);
        var p1=ts.deriveObjectType("Person");
        var p2=ts.deriveObjectType("Person");
        assertLength(1, [new AdditionalPropertyIs(p1), new AdditionalPropertyIs(p2)]);
        assertNothing([new AdditionalPropertyIs(ts.NUMBER), new AdditionalPropertyIs(ts.BOOLEAN)]);
    })
    it ("map property is 1",function(){
        assertLength(1, [new MapPropertyIs("a",ts.SCALAR), new MapPropertyIs("a",ts.NUMBER)]);
        assertLength(1, [new MapPropertyIs("a",ts.NUMBER), new MapPropertyIs("a",ts.SCALAR)]);
        var p1=ts.deriveObjectType("Person");
        var p2=ts.deriveObjectType("Person");
        assertLength(1, [new MapPropertyIs("a",p1), new MapPropertyIs("a",p2)]);
        assertNothing([new MapPropertyIs("a",ts.NUMBER), new MapPropertyIs("a",ts.BOOLEAN)]);

    })
    it ("typeof test",function(){
        assertLength(1,[new TypeOfRestriction("number"),new TypeOfRestriction("number")]);
        assertNothing([new TypeOfRestriction("number"),new TypeOfRestriction("boolean")]);
    })
    it ("enum test",function(){
        assertNothing([new Enum(["a","b"]),new Enum(["d","c"])]);
        assertLength(1,[new Enum(["a","b"]),new Enum(["b","c"])]);
        assertLength(2,[new Enum(["a","b"]),new MinProperties(2)]);
    })
    it ("pattern",function(){
        assertLength(1,[new Pattern("A"),new Pattern("A")]);
        assertLength(2,[new Pattern("a"),new MinProperties(2)]);
    })
    it ("min items",function (){
        assertNothing([new MinItems(5),new MaxItems(3)]);
        assertLength(1,[new MinItems(2),new MinItems(3)]);
        assertLength(1,[new MinItems(3),new MinItems(2)]);
        assertLength(2,[new MinItems(3),new MaxItems(4)]);
    })
    it ("max items",function (){
        assertNothing([new MinItems(5),new MaxItems(3)]);
        assertLength(1,[new MaxItems(2),new MaxItems(3)]);
        assertLength(1,[new MaxItems(3),new MaxItems(2)]);
        assertLength(2,[new MinItems(3),new MaxItems(4)]);
    })
    it ("min properties",function (){
        assertNothing([new MinProperties(5),new MaxProperties(3)]);
        assertLength(1,[new MaxProperties(2),new MaxProperties(3)]);
        assertLength(1,[new MaxProperties(3),new MaxProperties(2)]);
        assertLength(2,[new MaxProperties(5),new MinProperties(4)]);
    })
    it ("min length composition",function(){
        assertNothing([new MaxLength(4),new MinLength(6)])
        assertLength(1,[new MinLength(3),new MinLength(2)]);
        assertLength(1,[new MinLength(2),new MinLength(3)]);
        assertLength(2,[new MinLength(6),new MinProperties(3)]);
    })
})
describe("Type family",function(){
    it("type family 1", function(){
        var q=ts.deriveObjectType("Person")
        var q1=ts.derive("Manager",[q]);
        var q2=ts.derive("Executive",[q1]);
        var q3=ts.derive("Rogue",[q]);
        var fam= q.typeFamily();
        assert.equal(fam.length,4);
        assert.isTrue(fam.indexOf(q)!=-1);
        assert.isTrue(fam.indexOf(q1)!=-1);
        assert.isTrue(fam.indexOf(q2)!=-1);
        assert.isTrue(fam.indexOf(q3)!=-1);
    });
    it("type family 2", function(){
        var q=ts.deriveObjectType("Person")
        var q1=ts.derive("Manager",[q]);
        var q2=ts.derive("Executive",[q1]);
        var q3=ts.deriveObjectType("Animal");
        var q4=ts.union("PersonOrAnymal",[q,q3]);
        var family=q4.typeFamily();
        assert.equal(family.length,4);
        assert.isTrue(family.indexOf(q2)!=-1);
        assert.isTrue(family.indexOf(q3)!=-1);
    });
    it("type family 3", function(){
        var q=ts.deriveObjectType("Person")
        q.addMeta(new ts.Abstract());
        var q1=ts.derive("Manager",[q]);
        var q2=ts.derive("Executive",[q1]);
        var q3=ts.deriveObjectType("Animal");
        var q4=ts.union("PersonOrAnymal",[q,q3]);
        var family=q4.typeFamily();
        assert.equal(family.length,3);
        assert.isTrue(family.indexOf(q2)!=-1);
        assert.isTrue(family.indexOf(q3)!=-1);
    });
    it("type family 4", function(){
        var q=ts.deriveObjectType("Person")
        q.addMeta(new ts.Internal());
        var q1=ts.derive("Manager",[q]);
        var q2=ts.derive("Executive",[q1]);
        var q3=ts.deriveObjectType("Animal");
        var q4=ts.union("PersonOrAnymal",[q,q3]);
        var family=q4.typeFamily();
        assert.equal(family.length,3);
        assert.isTrue(family.indexOf(q2)!=-1);
        assert.isTrue(family.indexOf(q3)!=-1);
    });
});
describe("Facet Registry",function() {
    it ("All facets",function (){
        assert.equal(facetRegistry.getInstance().allPrototypes().length,29);
    });
    it ("All object facets",function (){
        assert.equal(facetRegistry.getInstance().applyableTo(ts.OBJECT).length,19);
    });
    it ("All meta",function (){
        assert.equal(facetRegistry.getInstance().allMeta().length,12);
    });
})
describe("Automatic classification",function(){
    it("ac 1", function(){
        var t1=ts.union("numberOrString",[ts.NUMBER,ts.STRING]);
        var t2=ts.union("numberOrBoolean",[t1,ts.BOOLEAN])
        t2.addMeta(new ts.Polymorphic());
        var t=t2.ac(false);
        assert.equal(t,ts.BOOLEAN);
        t=t2.ac(1);
        assert.equal(t,ts.NUMBER);
    });
    it("ac 2", function(){
        var t1=ts.union("numberOrString",[ts.NUMBER,ts.STRING]);
        t1.addMeta(new ts.Polymorphic());
        var t=t1.ac(false);
        assert.equal(t,ts.NOTHING);
        t=t1.ac(1);
        assert.equal(t,ts.NUMBER);
    });
    it("ac 3", function(){
        var t1=ts.derive("myNumber",[ts.NUMBER]);
        var t2=ts.union("numberOrString",[t1,ts.STRING])
        var t=t2.ac(false);
        assert.equal(t,ts.NOTHING);
        t=t2.ac(1);
        assert.equal(t,t1);
    });
    it("ac 4", function(){
        var t1=ts.derive("myNumber",[ts.NUMBER]);
        t1.addMeta(new ts.Polymorphic())
        t1.addMeta(new ts.Abstract());
        var t=t1.ac(false);
        assert.equal(t,ts.NOTHING);
        t=t1.ac(1);
        assert.equal(t,ts.NOTHING);
    });
    it("ac 5", function(){
        var p0=ts.deriveObjectType("Person");
        p0.declareProperty("x",ts.STRING,false);
        var p1=ts.deriveObjectType("Person2");
        p1.declareProperty("x",ts.BOOLEAN,false);
        var p3=ts.union("X",[p0,p1]);
        var tr=p3.ac({x: true});
        assert.equal(tr,p1);
    });
    it("ac 6", function(){
        var p0=ts.deriveObjectType("Person");
        p0.declareProperty("x",ts.STRING,false);
        var p1=ts.deriveObjectType("Person2");
        p1.declareProperty("x",ts.STRING,false);
        var p3=ts.union("X",[p0,p1]);
        var tr=p3.ac({x: true});
        assert.equal(tr,ts.NOTHING);
    });
    it("ac 7", function(){
        var p0=ts.deriveObjectType("Person");
        p0.declareProperty("x",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.declareProperty("y",ts.STRING,false);
        var p3=ts.union("X",[p0,p1]);
        var tr=p3.ac({x: "d"});
        assert.equal(tr,p0);
    });
    it("ac 8", function(){
        var p0=ts.deriveObjectType("Person");
        p0.declareProperty("x",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d"});
        assert.equal(tr,p0);
    });
    it("ac 9", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ts.Polymorphic());
        p0.declareProperty("x",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d"});
        assert.equal(tr,p0);
    });
    it("ac 10", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ts.Polymorphic());
        p0.declareProperty("x",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d",y:"b"});
        assert.equal(tr,p1);
    });
    it("ac 11", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ms.Discriminator("kind"))
        p0.declareProperty("x",ts.STRING,false);
        p0.declareProperty("kind",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d",y:"b",kind:"Person"});
        assert.equal(tr,p0);
    });
    it("ac 12", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ms.Discriminator("kind"))
        p0.addMeta(new ms.DiscriminatorValue("Person2"))
        p0.declareProperty("x",ts.STRING,false);
        p0.declareProperty("kind",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d",y:"b",kind:"Person"});
        assert.equal(tr,p0);
    });
    it("ac 13", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ts.Polymorphic());
        p0.addMeta(new ms.Discriminator("kind"))
        p0.addMeta(new ms.DiscriminatorValue("Person2"))
        p0.declareProperty("x",ts.STRING,false);
        p0.declareProperty("kind",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.addMeta(new ms.DiscriminatorValue("Person"))
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d",y:"b",kind:"Person"});
        assert.equal(tr,p1);
    });
    it("ac 14", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ts.Polymorphic());
        p0.addMeta(new ts.Abstract())
        p0.declareProperty("x",ts.STRING,false);
        p0.declareProperty("kind",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.addMeta(new ms.DiscriminatorValue("Person"))
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d",y:"b",kind:"Person"});
        assert.equal(tr,p1);
    });
    it("ac 15", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ts.Abstract())
        p0.declareProperty("x",ts.STRING,false);
        p0.declareProperty("kind",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.addMeta(new ms.DiscriminatorValue("Person"))
        var p1=ts.derive("Person3",[p0]);
        p1.addMeta(new ms.DiscriminatorValue("Person"))
        p1.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d",y:"b",kind:"Person"});
        assert.equal(tr,p0);
    });
    it("ac 16", function(){
        var p0=ts.deriveObjectType("Person");
        p0.addMeta(new ms.Discriminator("kind"))
        p0.addMeta(new ts.Abstract())
        p0.declareProperty("x",ts.STRING,false);
        p0.declareProperty("kind",ts.STRING,false);
        var p1=ts.derive("Person2",[p0]);
        p1.addMeta(new ms.DiscriminatorValue("Person"))
        var p2=ts.derive("Person3",[p0]);
        p2.declareProperty("y",ts.STRING,false);
        var tr=p0.ac({x: "d",y:"b",kind:"Person"});
        assert.equal(tr,p0);
    });
});
describe("TypeExpressions",function() {
    it ("Literal is parsed correctly",function (){
        assert.equal(typeExpressions.parseToType("object",ts.builtInRegistry()),ts.OBJECT);
    });
    it ("basic array type is parsed",function (){
        assert.isTrue(typeExpressions.parseToType("object[]",ts.builtInRegistry()).isSubTypeOf(ts.ARRAY));
    });
    it ("basic union type is parsed",function (){
        assert.isTrue(typeExpressions.parseToType("number | string",ts.builtInRegistry()) instanceof ts.UnionType);
    });
    it ("union type in parens is parsed",function (){
        assert.isTrue(typeExpressions.parseToType("(number | string)",ts.builtInRegistry()) instanceof ts.UnionType);
    });
    it ("union type in parens + [] is parsed",function (){
        assert.isTrue(typeExpressions.parseToType("(number | string)[]",ts.builtInRegistry()).isSubTypeOf(ts.ARRAY));
    });
    it ("incorrect expression",function (){
        assert.isTrue(typeExpressions.parseToType("ddd",ts.builtInRegistry()).isSubTypeOf(ts.UNKNOWN));
    });
    it ("incorrect expression2",function (){
        assert.isTrue(typeExpressions.parseToType("((ddd",ts.builtInRegistry()).isSubTypeOf(ts.UNKNOWN));
    });

    it ("Literal is stored correctly",function (){
        assert.equal(typeExpressions.storeToString(typeExpressions.parseToType("object",ts.builtInRegistry())),"object");
    });
    it ("basic array type is stored",function (){
        assert.equal(typeExpressions.storeToString(typeExpressions.parseToType("object[]",ts.builtInRegistry())),"object[]");
    });
    it ("basic union type is parsed",function (){
        assert.equal(typeExpressions.storeToString(typeExpressions.parseToType("number | string",ts.builtInRegistry())),"number | string");
    });
    it ("union type in parens is parsed",function (){
        assert.equal(typeExpressions.storeToString(typeExpressions.parseToType("(number | string)",ts.builtInRegistry())),"number | string");
    });
    it ("union type in parens + [] is stored correctly",function (){
        assert.equal(typeExpressions.storeToString(typeExpressions.parseToType("(number | string)[]",ts.builtInRegistry())),"(number | string)[]");
    });
    it ("incorrect expression stored",function (){
        assert.equal(typeExpressions.storeToString(typeExpressions.parseToType("ddd[]",ts.builtInRegistry())),"ddd[]");
    });
    it ("incorrect expression2 stored",function (){
        assert.equal(typeExpressions.storeToString(typeExpressions.parseToType("((ddd",ts.builtInRegistry())),"((ddd");
    });
})
describe("Extras",function() {

    it ("has property accept null",function (){
        assert.isTrue(new rs.HasProperty("a").check(null).isOk());
    });
})