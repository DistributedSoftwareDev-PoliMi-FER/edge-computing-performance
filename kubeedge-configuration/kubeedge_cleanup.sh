#!/bin/bash

kubectl delete -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/devices/devices_v1alpha2_device.yaml
kubectl delete -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/devices/devices_v1alpha2_devicemodel.yaml
kubectl delete -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/reliablesyncs/cluster_objectsync_v1alpha1.yaml
kubectl delete -f https://raw.githubusercontent.com/kubeedge/kubeedge/master/build/crds/reliablesyncs/objectsync_v1alpha1.yaml
cd manifests

kubectl delete -f 01-namespace.yaml
kubectl delete -f 03-clusterrole.yaml
kubectl delete -f 04-clusterrolebinding.yaml

