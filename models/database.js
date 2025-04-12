
const MongoClient = require('mongodb').MongoClient; // connects to mongo database

module.exports = function(app) { // allows us to export to other parts of the code

  // tries to connect to MongoDB using URL from settings
	MongoClient.connect(app.get('DB_URL'), {useNewUrlParser: true, useUnifiedTopology: true}, function(e, client) {
		if (e){ // checks for errors
			console.log(e); // logs errors
		}	else{
			const db = client.db(app.get('DB_NAME')); // if there are no errors, get database (client is the object used to interact w database)
		  // initialize other databases here //
			require('./accounts').init(db); // initialise accounts module
			log('mongo :: connected to database :: "'+app.get('DB_NAME')+'"'); // success message
		}
	});
}