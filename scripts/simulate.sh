#!/bin/bash
uuid=$(uuidgen)
score=$((RANDOM % 981 + 20))

response=$(curl -s -X POST \
    -d "{\"gameUuid\": \"$uuid\", \"score\": $score}" \
    -H 'accept: application/json' \
    -H "Content-Type: application/json" \
    http://localhost:8081/games/start)

echo -e "Player 1 starts a game with Player 2, Response Body: $response \n"
new_score=$(echo "$response" | jq -r '.responseObject.newScore')
sleep 2

response=$(curl -s -X POST \
    -d "{\"gameUuid\": \"$uuid\", \"score\": $new_score}" \
    -H 'accept: application/json' \
    -H "Content-Type: application/json" \
    http://localhost:8080/games/start)

echo -e "Player 2 starts same game with Player 1, Response Body: $response \n"
sleep 2

while true
do
    new_score=$(echo "$response" | jq -r '.responseObject.newScore')
    while true
    do
        response=$(curl -s -X POST \
            -d "{\"gameUuid\": \"$uuid\", \"score\": $new_score}" \
            -H 'accept: application/json' \
            -H "Content-Type: application/json" \
            http://localhost:8081/games/play)
        status_code=$(echo "$response" | jq -r '.statusCode')
   
    if [[ "$status_code" == "400" || "$status_code" == "403" ]]; then
        echo -e "Error: Player 2 responded with status $response \n"
        exit 1
    fi

    if [[ "$status_code" != "423" ]]; then
        echo -e "Player 2, Response Body: $response \n"
        break
    else
        echo -e "Player 2 is busy, Response Body: $response \n"
    fi
    sleep 2
    done

    # Check if response contains "win == true"
    if [[ "$response" == *"\"win\":true"* ]]; then
        echo -e "Player 2 won! \n"
        break
    fi
    sleep 2

    new_score=$(echo "$response" | jq -r '.responseObject.newScore')
    while true
    do
        response=$(curl -s -X POST \
            -d "{\"gameUuid\": \"$uuid\", \"score\": $new_score}" \
            -H 'accept: application/json' \
            -H "Content-Type: application/json" \
            http://localhost:8080/games/play)
        status_code=$(echo "$response" | jq -r '.statusCode')
   
    if [[ "$status_code" == "400" || "$status_code" == "403" ]]; then
        echo -e "Error: Player 1 responded with status $response \n"
        exit 1
    fi

    if [[ "$status_code" != "423" ]]; then
        echo -e "Player 1, Response Body: $response \n"
        break
    else
        echo -e "Player 1 is busy, Response Body: $response \n"
    fi
    sleep 2
    done

    # Check if response contains "win == true"
    if [[ "$response" == *"\"win\":true"* ]]; then
        echo -e "Player 1 won! \n"
        break
    fi
    sleep 2
done