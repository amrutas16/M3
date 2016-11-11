#!/bin/sh

cd prod
ansible-playbook prodDeployment.yml -i inventory

cd ../canary
ansible-playbook canaryDeployment.yml -i inventory

