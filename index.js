var app = new Vue({
  el: '#app',
  data: {
    blockchain: 'hello',
    address: '1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD',
    apiToken: 'fc0086baf6c24c2b9e389753179b76af',
    outflows: []
  },
  methods: {
  	getaddressdata: function() {
  		this.getoutflowaddressdata(this.address, 1)
  	}, 	
  	getoutflowaddressdata: function(_address, _depth){
  		if(_depth<1) {
  			return;
  		}
  		var addressData = [];
  		var self = this;
  		$.get(`https:api.blockcypher.com/v1/btc/main/addrs/${_address}/full?before=300000?token=${self.apiToken}`).then(function(_data) {
		  		addressData = _data
	  		var address = addressData.address;
	  		var transactions = addressData.txs;
	  		console.log(`Transaction Details for: ${addressData.address}`)

	  		for (var i = transactions.length - 1; i >= 0; i--) {
	  			console.log(`${transactions[i].hash} at height ${transactions[i].block_height}`)
	  			for (var j = transactions[i].outputs.length - 1; j >= 0; j--) {

	  				if(address == transactions[i].outputs[j].addresses[0]) {
	  					self.outflows.push(`${transactions[i].outputs[j].addresses[0]} ${transactions[i].outputs[j].value/100000000} BTC (change)`);
	  					console.log(`${transactions[i].outputs[j].addresses[0]} ${transactions[i].outputs[j].value/100000000} BTC (change)`)
	  				} else {
	  					self.outflows.push(`${transactions[i].outputs[j].addresses[0]} ${transactions[i].outputs[j].value/100000000} BTC`);
	  					console.log(`${transactions[i].outputs[j].addresses[0]} ${transactions[i].outputs[j].value/100000000} BTC`)
	  					self.getoutflowaddressdata(transactions[i].outputs[j].addresses[0], _depth - 1)
	  				}
	  			}
	  		}

  		});

  	}
  }
});
// https://api.blockcypher.com/v1/btc/main
// https://api.blockcypher.com/v1/btc/main/addrs/1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD/full?before=300000