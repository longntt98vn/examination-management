curl --include --header "X-Api-Key: ${SAMPLE_APIKEY}" --request OPTIONS http://localhost:8080/api/assets/asset7

curl --header "X-Api-Key: ${SAMPLE_APIKEY}" http://localhost:8080/api/assets


curl --header "X-Api-Key: ${SAMPLE_APIKEY}" http://localhost:8080/api/jobs/__job_id__


./network.sh deployCC -ccn candidate -ccl typescript -ccv 1.7 -ccs 8 -ccp ../chaincode
