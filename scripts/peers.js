var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , settings = require('../lib/settings')
  , request = require('request');

//var COUNT = 5000; // number of blocks to index (5000)

function exit() {
  mongoose.disconnect();
  process.exit(0);
}

var dbString = 'mongodb://' + settings.dbsettings.user;
dbString = dbString + ':' + settings.dbsettings.password;
dbString = dbString + '@' + settings.dbsettings.address;
dbString = dbString + ':' + settings.dbsettings.port;
dbString = dbString + '/' + settings.dbsettings.database;

mongoose.connect(dbString, async function(err) {

  if (err) {

    console.log('Unable to connect to database: %s', dbString);
    console.log('Aborting');
    exit();

  } else {

    /*
    db.drop_peers_all( function() {
      console.log('Dropped all...');
    });
    db.drop_peers("87.128.26.118", function() {
      console.log('Peer 87.128.26.118 dropped...');
    });
    db.drop_peers("206.189.183.213", function() {
      console.log('Peer 206.189.183.213 dropped...');
    });
    */
      
  
    request({uri: 'http://127.0.0.1:' + settings.port + '/api/getpeerinfo', json: true}, async function (error, response, body) {

      //dbresult = [];
      for (anode in body) {

        //console.log(anode);
        //console.log(body[anode]['addr']);

        addressparts = body[anode]['addr'].split(":");
        address = addressparts[0];
        port = addressparts[1];
        version = body[anode]['version'];
        subver = body[anode]['subver'].replace('/', '').replace('/', '');

        peerobj = {
          address: address,
          port: port,
          protocol: version,
          version: subver
        }

        if ( version == "70015" && port > 0 && !address.startsWith("192.168.") && !address.startsWith("10.0.") && !address.startsWith("127.0.") ) {

          console.log(`Processing ${address}:${port}...`);
          dbresult = db.find_peer(peerobj, async function(peer) {

            //console.log("Reply:\n",peer);

            if (peer['status'] == 'not found') {
              // Geolocate and add to database
              console.log(`Trying to add ${peer['address']}:${peer['port']} to database...`);
              console.log(`Geodecoding ${peer['address']}...`);
              request({uri: 'https:///reallyfreegeoip.org/json/' + peer['address'], json: true}, async function (error, response, geo) {
                db.create_peer({
                  address: peer['address'],
                  port: peer['port'],
                  protocol: peer['protocol'],
                  version: peer['version'].replace('/', '').replace('/', ''),
                  country: geo.country_name,
                  country_code: geo.country_code
                }, async function(){
                  console.log(`Added ${peer['address']}:${peer['port']} (${geo.country_name}, ${geo.country_code})`);
                  //exit();
                });

              });
            } else {
              console.log(`Already on database ${peer['address']}:${peer['port']}`);
              //exit();
            }


          }); // dbresult

        } else {
          console.log(`Skipping ${address}:${port} (no public IP address)`);
        } // if !address.startsWith("192.168")

      //console.log("Next...");

      } // for

      //exit();

      ////////////////////////////////////////////////////////////////////////////////

    });
  }
});


// waits for 10 turns (seconds) to give time for other processes to finish, then exits


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    for (let i = 0; i < 10; i++) {
        console.log(`Countdown: ${10 - i}`);
        await sleep(i * 1000);
    }
    console.log('Done');
    exit();
}

demo();





