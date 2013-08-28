function Marshall(opts){
  if (!(this instanceof Marshall)){
    return new Marshall(opts)
  }
  this.opts = opts || {}
  this.resolver = this.opts.resolver
}

Marshall.prototype = {
  dump: function(obj){
    return JSON.stringify(obj, this.replacer)
  },
  replacer: function(key, value){
    var type = value.constructor.name
    if (type === 'String'){
      return value
    }else if (type === 'Object'){
      return value
    }else{
      var ret = {type: type}
      for (var key in value){
        ret[key] = value[key]
      }
      return ret
    }
  },
  load: function(str){
    var marshall = this
    return JSON.parse(str, function(key, value){
      return marshall.reviver(this, key, value)
    })
  },
  reviver: function(parent, key, value){
    var type = value.type
    if (type){
      var ctr = this.resolver[type]
      var ret = new ctr
      return ret
    }else{
      return value
    }
  }
}

module.exports = Marshall
