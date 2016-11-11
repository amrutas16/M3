# MileStone3
Devops MileStone3

### Setup

* We have used digitalocean droplets to host our servers.
* We have seperate droplets to host the below servers/environment
  1) Production server
  2) Canary server
  3) Proxy server and Redis global store

### Tasks
<hr>
#### The ability to deploy software to the production environment triggered after build, testing, and analysis stage is completed. The deployment needs to occur on actual remote machine/VM (e.g. AWS, droplet, VCL), and not a local VM.
* For hosting the production environment we have a droplet, which runs the application using the bare repository configured on it.
* We have used jenkins to perform builds along with testing and static analysis
* For unit testing we have used the Mocha framework for testing javascript applications.
* We have used PMD for static analysis
* The build is triggered on a git commit. After the build is successful, we trigger a push to our local repository as well to   the bare repository.
* After each build, the latest version of the software runs in production environment and canary environment.

#### The ability to configure a production environment automatically, including all infrastructure components, such web server, app service, load balancers, and redis stores. Configure should be accopmlished by using a configuration management tool, such as ansible, or docker. Alternatively, a cluster management approach could also work (e.g., kubernates).
* We have used ansible to setup redis store on one droplet.
* The Ip address and port number of the droplet hosting the redis store, are stored in a text file
* Using ansible we transfer the text files to the production environment and canary environment, which can be used to access   the redis store.
* Npm, nodejs, git are all installed on production using ansible

#### The ability to monitor the deployed application (using at least 2 metrics) and send alerts using email or SMS (e.g., smtp, mandrill, twilio). An alert can be sent based on some predefined rule.
* New Relic is used to monitor two metrics of the production environment.
* Alerts are sent via email if the cpu performance goes above 20% and the memory utilization is above 20%.

#### The ability to autoscale individual components of production and maintain and track in a central discovery service. Autoscale can be triggered by a predefined rule.
* New relic service running on production, sends alerts when the metrics exceed their expected value. We have used this         criteria to autoscale the production environment.
* For every alert, we are spinning a new droplet that will host the application.
* The list of every available server is stored in the global redis store and can be seen by making a request to            
  '/listservers'.

#### The ability to use feature flags, serviced by a global redis store, to toggle functionality of a deployed feature in production.
* The production environment currently runs the '/set' and '/get' functionality from HW3.
* We are switching off the '/set' functionality by using the feature flags.
* The '/on' request is made from the local machine, to toggle the value of a 'feature' in the global redis store.
* Based on the value of the 'featureFlags' key, the '/set' feature is accessible/ not accessible in production environment.

#### The ability to perform a canary release: Using a proxy/load balancer server, route a percentage of traffic to a newly staged version of software and remaining traffic to a stable version of software. Stop routing traffic to canary if alert is raised.
* The canary droplet currently runs one additional functionality as compared to the production environment i.e it does not     display i.e '/meow' images with size greater than 50,000.
* Proxy server intially routes 25% traffic to canary.
* On receiving an '/upload' for such image, the proxy will stop routing to the canary server and route only to production.

Check out the youtube videos here:
* [Task 1,2,5](https://www.youtube.com/watch?v=2vMwlwFRMuM)
* [Task 3,4]()
* [Task 6](https://www.youtube.com/watch?v=NO34TEJAbv4)


