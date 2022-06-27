clear
echo "Clearing PIDs..."
sudo rm -f /home/ubuntu/outracoin-explorer/tmp/*
echo "Starting outrachain.org..."
cd /home/ubuntu/outracoin-explorer
##npm start
npm start bin/cluster

