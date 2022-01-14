## Stress testing 

# Requirements:
	- systemd-nspawn
	- machinect

# Steps:

0. extract the debian filesystem from the **testingBuild.tar.gz** file

1. increase fs.inotify values	(sysctl fs.inotify)
	example -> sudo sysctl fs.inotify.max_queued_events=65535 
		or write to /etc/sysctl.d/90-override.conf

2. add /etc/dbus-1/system.d/my_system.conf to configure dbus

example -> 
```
			<busconfig>
			  <limit name="max_connections_per_user">100000</limit>
			  <limit name="max_pending_service_starts">10000</limit>
			  <limit name="max_names_per_connection">50000</limit>
			  <limit name="max_match_rules_per_connection">50000</limit>
			  <limit name="max_replies_per_connection">50000</limit>
			</busconfig>
```
			
3. reload **dbus.service**

4. create a bridge interface named **br2** and bind it to a network interface that has access to a DHCP server (example files in the **exampleBridge folder**)

5. enter the **EdgeStressTest** folder with root permissions

6. set environment variable **NUM** to the number of machines

7. put the module to be used in the **testingBuild** filesystem and configure it using **systemd-nspawn**

8. the debian filesystem in **testingBuild** is used as a base for all the containers

9. run the scripts in the folowing order: create_masine, start_masine, stop_masine, remove_masine
