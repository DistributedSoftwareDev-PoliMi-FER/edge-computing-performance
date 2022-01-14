#!/bin/bash
function usage {
   cat << EOF
Usage: -t <token> -a <cloudcore-ip>

Optional: -n <node-name>
	  -v <kubeedge version> : default 1.9.0

You must pass the token and the cloudcore address to join the cluster
EOF
   exit 1
}


if [[ ! "$@" =~ "-t" ]]; then
   usage
fi
if [[ ! "$@" =~ "-a" ]]; then
   usage
fi

VERSION="1.9.0"
NODE_NAME="edge-node-$(tr -dc a-z0-9 </dev/urandom | head -c 6)"

while getopts 'ht:a:n:v:' flag; do
  case "${flag}" in
  	v) VERSION=${OPTARG} ;;
  	t) TOKEN=${OPTARG} ;;
  	n) NODE_NAME=${OPTARG} ;;
  	a) ADDRESS=${OPTARG} ;;
	h) usage ;;
    *) usage ;;
  esac
done


if ! command -v docker &> /dev/null
then
    echo "[*] docker could not be found"
    echo "[!] installing docker"
    sudo apt-get -q update -y
    sudo apt-get -q install ca-certificates curl gnupg lsb-release -y
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get -q install docker-ce docker-ce-cli containerd.io
fi

if ! command -v keadm &> /dev/null
then
   echo "[*] keadm could not be found"
   echo "[!] installing keadm"
   wget -q https://github.com/kubeedge/kubeedge/releases/download/v1.8.0/keadm-v1.8.0-linux-amd64.tar.gz
   tar xf keadm-v1.8.0-linux-amd64.tar.gz
   cp keadm-v1.8.0-linux-amd64/keadm/keadm /usr/bin
   rm -rf keadm-v1.8.0-linux-amd64*
else
   keadm reset
   rm /etc/systemd/system/edgecore.service
fi

keadm join --kubeedge-version $VERSION --cloudcore-ipport $ADDRESS:10000 --edgenode-name $NODE_NAME --token $TOKEN
