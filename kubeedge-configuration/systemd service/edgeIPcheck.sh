#!/bin/bash

# get public IP
publicIP=$(dig +short myip.opendns.com @resolver1.opendns.com)

# get edge IP
edgeIP=$(grep -n "nodeIP" /etc/kubeedge/config/edgecore.yaml | grep -oE '((1?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}(1?[0-9][0-9]?|2[0-4][0-9]|25[0-5])')

# check if public IP is the same as edge IP
if [[ "$publicIP" == "$edgeIP" ]]; then
    # nothing
    true
else
    # change the edge IP to public IP
    systemctl stop edgecore
    sed -i "s/$edgeIP/$publicIP/" /etc/kubeedge/config/edgecore.yaml
    curl -X PUT -H "Content-Type: application/json" -d '{"id":"edge-node-NAME"}' https://edge-computing.polimi-ecb7249.gcp.mia-platform.eu/api/location-service/
    systemctl start edgecore
fi
