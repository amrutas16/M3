cd redis
echo 'Setting up redis store...'
ansible-playbook redisConf.yml -i inventory

cd ../prod
echo 'Configuring production server...'
ansible-playbook prodConf.yml -i inventory

cd ../canary
echo 'Configuring canary server...'
ansible-playbook canaryConf.yml -i inventory

echo 'Configured..'