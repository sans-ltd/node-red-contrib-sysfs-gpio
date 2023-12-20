var Gpio = require('onoff').Gpio;

module.exports = function(RED) {
  "use strict";  
  function sysfsGpioInNode(config){
    RED.nodes.createNode(this,config);
    var node = this;
    var monitoringPin;
    node.pin=config.pin;
    node.enableInterrupt=config.enableInterrupt;
    node.enableLow=config.enableLow;
    var options ={
      debounceTimeout: config.debounce || 0,
      activeLow: config.enableLow || false
    }

    function init() {
      try {
        if(node.enableLow === true ) options.activeLow = true;
        monitoringPin = new Gpio(node.pin, 'in', config.edge, options);
      }
      catch (e) {
        //node.log(">>>> "+e);
        node.log(">>>> No interrupt available for this pin.");
        node.enableInterrupt=false;
        if (monitoringPin===undefined)
          monitoringPin = new Gpio(node.pin, 'in', config.edge, options);
        //throw(e);
      }
      monitoringPin.unwatch();

      //Set up interrupt
      if(node.enableInterrupt === true){
        monitoringPin.watch(function(err, value){
          if (err) node.log("gpio.input.error");
          node.send({ topic:"GPIO "+node.pin, payload:Number(value), interrupt: true });
          node.buttonState = value;
          node.status({fill:"green",shape:"dot",text:value});
          if (RED.settings.verbose) { node.log("out: "+value); }
        });
      }
    }

    if(node.pin !== ''){
      init();
    }

    this.on('input', function(msg){
        var reading = monitoringPin.readSync();
        node.send({ topic:"GPIO "+node.pin, payload:Number(reading), interrupt: false });
        node.buttonState = reading;
        node.status({fill:"green",shape:"dot",text:reading});
        if (RED.settings.verbose) { node.log("out: "+reading); }
    })

    this.on('close', function(){
      node.log("close ");
      //if(node.enableInterrupt == 'true'){
        monitoringPin.unwatch();
      //}
      monitoringPin.unexport();
    })
  }
  RED.nodes.registerType("sysfs_gpio_in",sysfsGpioInNode);  
}
