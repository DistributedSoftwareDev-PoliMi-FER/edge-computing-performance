A systemd service to monitor and change the node IP to the correct public IP.

Deploy systemd service on Edge node:
```
cp edgeIPcheck.sh /usr/local/bin
cp edgeIP.service /etc/systemd/system
cp edgeIP.timer /etc/systemd/system
systemctl daemon-reload
systemctl enable edgeIP.timer
systemctl start edgeIP.timer
```