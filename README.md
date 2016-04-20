brybot
======

node.js irc bot.

Commands:

* !magic8ball / !8ball
* !brybot
* !xdy
  * Where x is the number of dice and y is the number of sides.
* !kick

Systemd and you:
* Create your brybot.service file.
* Put it in /etc/systemd/system/
* Use the systemctl enable command to configure your service to start at boot time
* Use the systemctl start command to start your service

Useful systemctl commands:
* systemctl enable <service name> - will configure your service to start at boot time
* systemctl disable <service name> - will configure your service to NOT start at boot time
* systemctl start <service name> - will boot up your service
* systemctl stop <service name> - will make your service stop running for the time being
* systemctl status <service name> - gives you the status of your service
