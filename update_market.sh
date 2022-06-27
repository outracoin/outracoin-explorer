#!/bin/bash
cd /home/ubuntu/outracoin-explorer
while :
do
	echo "Updating outracoin_explorer..."
        echo "Press [CTRL+C] to stop.."
	cd /home/ubuntu/outracoin-explorer
	#rm -f /home/ubuntu/outracoin-explorer/tmp/* -R
	echo "Updating market..."
	/usr/bin/node scripts/sync.js market
	echo "Done."
	echo "Pausing for 10 minutes..."
	sleep 600
done
