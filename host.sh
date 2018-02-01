host_url=$1
hub_pw=$2
hostname=$3

curl -X POST "$hub_url/post/services" --data "{admin_password: $hub_pw, host = $hostname}"

nodejs index.js $hostname
