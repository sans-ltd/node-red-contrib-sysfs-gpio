var Gpio = require('onoff').Gpio;

module.exports = function(RED) {
  "use strict";
  function opiOutNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.name = config.name;
      node.pin = config.pin;
      node.log("Pin: "+node.pin);
      node.set = config.set;
      node.level = config.level;
      node.enableLow = config.enableLow;
      var outpin;
      var options ={
        activeLow: config.enableLow || false
      }

    // init:
    if(node.pin !== ''){
      node.log("OUT activeLOW:"+node.enableLow);
      if(node.enableLow === true ) options.activeLow = true;
      outpin = new Gpio(node.pin, 'out', '', options);
      outpin.unwatch();
    }

    if (node.set === true){
        outpin.write(Number(node.level), function(err) {
            if (err) node.log("gpio.output.error");
        });
        node.status({fill:"green",shape:"dot",text:node.level.toString()});
    }

    this.on('input', function(msg){
      outpin.write(Number(msg.payload), function(err) {
        if (err) node.log("gpio.output.error");
      });
      node.status({fill:"green",shape:"dot",text:msg.payload.toString()});
      if (RED.settings.verbose) { node.log("out: "+msg.payload); }
    });

    this.on('close', function(){
      outpin.unexport();
      node.log("close ");
    })
  }
  RED.nodes.registerType("opi_out",opiOutNode);
}
