echo 'requesting all heroes'
curl localhost:3250/heroes

echo 'requesting gragote'
curl localhost:3250/heroes/1

echo 'requesting with wrong body'
curl --silent -X POST \
    --data-binary '{"invalid": "data"}' \
    localhost:3250/heroes

echo 'creating Luanzito'
CREATE=$(curl --silent -X POST \
    --data-binary '{"name": "Luanzito", "age": "23", "power": "fazer merda sempre"}' \
    localhost:3250/heroes)




curl localhost:3250/heroes/1632530201108