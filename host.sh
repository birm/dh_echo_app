hub_url=$1
hub_pw=$2
hostname=$3

bash wait_for.sh $hub_url
curl -X POST "$hub_url/post/services" --data "{admin_password: $hub_pw, service:echo host:$hostname}"

nodejs index.js $hub_url
