var marshaller = require('./')
var assert = require('assert')
mocha.setup('tdd')

function Person(name){
  this.name = name
}
Person.fields = {
  children: ["Person"],
  spouse: "Person"
}

suite('dump', function(){
  test('basic object', function(){
    var marshall = marshaller()
    assert.equal(marshall.dump({}), '{}')
  })

  test('class', function(){
    
    var bob = new Person('bob')
    var marshall = marshaller()
    assert.equal(marshall.dump(bob), '{"type":"Person","name":"bob"}')

    bob.spouse = new Person('marie')
    assert.equal(marshall.dump(bob), '{"type":"Person","name":"bob","spouse":{"type":"Person","name":"marie"}}')
  })
})

suite('load', function(){
  test('basic object', function(){
    var marshall = marshaller()
    assert.deepEqual(marshall.load('{}'), {})
  })

  test('class', function(){
    var marshall = marshaller({resolver: {
      Person: Person
    }})
    var bob = marshall.load('{"type":"Person","name":"bob"}')
    assert(bob instanceof Person, 'bob is a person')
  })

  test('metadata', function(){
    var marshall = marshaller({
      meta: {
        Person: {
          constructor: Person,
          fields: {
            children: ["Person"],
            spouse: "Person"
          }
        }
      }
    })

  })
})


