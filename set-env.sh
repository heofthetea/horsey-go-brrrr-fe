#!/bin/sh
# replaces all env variables with the prefix HORSEY_ENV_ with the ones passed into docker env
# i fucking hate vite and it's stupid reliance on .env FILES instead of operating system variables
# seriously what deranged motherfucker who has never seen a shell thought this is a good idea
for i in $(env | grep HORSEY_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value
    # sed All files
    # find /usr/share/nginx/html -type f -exec sed -i "s|${key}|${value}|g" '{}' +

    # sed JS and CSS only
    find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done