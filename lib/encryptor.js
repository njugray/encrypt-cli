var crypto = require('crypto'),
	fs = require('fs');

var Encryptor = {};
//加密
Encryptor.cipher = function(algorithm, key, path, output){
	output = output || path + '.cpt';
    var cipher = crypto.createCipher(algorithm, key);
    var outputStream = fs.createWriteStream(output);
    var inputStream = fs.createReadStream(path);
    inputStream.on('data', function(data) {
        var buf = new Buffer(cipher.update(data), 'binary');
        outputStream.write(buf);
    });

    inputStream.on('end', function() {
        var buf = new Buffer(cipher.final('binary'), 'binary');
        outputStream.write(buf);
        outputStream.end();
    });
    
};

Encryptor.decipher = function(algorithm, key, path, output) {
	var decipher = crypto.createDecipher(algorithm, key);
	var inputStream = fs.createReadStream(path);
	var outputStream;
	if(output && output!= path){
    	outputStream = fs.createWriteStream(output);
    }
	var decrypted = '';
	inputStream.on('data', function(data) {
	    if(outputStream) {
	    	outputStream.write(new Buffer(decipher.update(data), 'binary'));
	    } else {
	    	decrypted += decipher.update(data, 'hex', 'binary');
	    }
	     
	});

	inputStream.on('end', function() {
	    if(outputStream) {
	    	outputStream.write(new Buffer(decipher.final('binary'), 'binary'));
	    	outputStream.end();
	    } else {
	    	decrypted += decipher.final('binary');
	    	console.log(decrypted);
	    }
	});
};

module.exports = Encryptor;