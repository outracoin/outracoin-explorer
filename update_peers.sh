#!/bin/bash
cd /home/ubuntu/outracoin-explorer
while :
do
echo "Updating peers..."
/usr/bin/node scripts/peers.js
echo "300 seconds pause..."
sleep 300
done
