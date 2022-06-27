#!/bin/bash
cd /home/ubuntu/outracoin-explorer
while :
do
	echo "Updating outracoin_explorer..."
        echo "Press [CTRL+C] to stop.."
	cd /home/ubuntu/outracoin-explorer
	rm -f /home/ubuntu/outracoin-explorer/tmp/index.pid
	printf "Updating blocks..."
	#/usr/local/bin/node scripts/sync.js index update > /dev/null 2>&1
	/usr/bin/node scripts/sync.js index update
	echo " Done."
	echo "Sleeping 3 seconds..."
	sleep 3
done
