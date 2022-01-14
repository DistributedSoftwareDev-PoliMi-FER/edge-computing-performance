#!/bin/bash
function usage {
   cat << EOF
Optional: -a <cloudcore-ip>
	  -v <kubeedge version> : default v1.9.0
	  -h for show this again
EOF
   exit 1
}

VERSION=v1.9.0
ADDRESS=1

while getopts 'ha:v:' flag; do
  case "${flag}" in
  	v) if [[ ${OPTARG} =~ ^v[0-9]\.[0-9]\.[0-9] ]]
		then 
			VERSION=${OPTARG}
		else 
			echo "Put a valid version number. Example: 'v1.8.2' (Default: v1.9.0)"
			exit 0
		fi 
		;;
  	a) if [[ ${OPTARG} =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]
	   then 
	    ADDRESS=${OPTARG}
	   else 
		echo "Put a valid ip address"
		exit 0
	   fi ;;
	h) usage ;;
    *) usage ;;
  esac
done


cd manifests

# except 05-configmap.yaml and 07-deployment.yaml
for resource in $(ls *.yaml); do kubectl create -f $resource; done

cd next

if [ $ADDRESS == 1 ]
then
	#Find the ip of the load balancer
	CLOUDCORE_LB_IP=$(kubectl get svc -n kubeedge | grep cloudcore-lb | awk '{print $4}')
	while [[ ! $CLOUDCORE_LB_IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]
	do
		sleep 3
		CLOUDCORE_LB_IP=$(kubectl get svc -n kubeedge | grep cloudcore-lb | awk '{print $4}')
	done
else
	CLOUDCORE_LB_IP=$ADDRESS
fi

# Put the right advertiseAddress
cp 05-configmap_template.yaml 05-configmap.yaml
sed -i "s/<lb-address>/$CLOUDCORE_LB_IP/g" 05-configmap.yaml

# Change KubeEdge version
cp 07-deployment_template.yaml 07-deployment.yaml
sed -i "s/<version>/$VERSION/g" 07-deployment.yaml

# Create configmap and deployment
for resource in $(ls *.yaml); do kubectl create -f $resource; done

#Apply CRDs
kubectl apply -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/devices/devices_v1alpha2_device.yaml
kubectl apply -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/devices/devices_v1alpha2_devicemodel.yaml
kubectl apply -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/reliablesyncs/cluster_objectsync_v1alpha1.yaml
kubectl apply -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/reliablesyncs/objectsync_v1alpha1.yaml

echo "[*] Getting the token..."
sleep 10
kubectl get secret -nkubeedge tokensecret -o=jsonpath='{.data.tokendata}' | base64 -d
