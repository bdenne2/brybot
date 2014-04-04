brybot
======

node.js irc bot.

Commands:

* !magic8ball / !8ball
* !brybot
* !d20

Systemd and you:
* Create your brybot.service file.
* Put it in /etc/systemd/system/
* Use the systemctl enable command to "register" your service with systemd
* Use the systemctl start command to start your service

Useful systemctl commands:
* systemctl enable <service name> - will register your service with systemd
* systemctl disable <service name> - will deregister your service with systemd
* systemctl start <service name> - will boot up your service
* systemctl stop <service name> - will make your service stop running for the time being
* systemctl status <service name> - gives you the status of your service
