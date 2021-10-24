#!/bin/bash
exec 0< servicesByLine
echo '' > report.log 2>report.err
while read line
do
curl 'http://localhost:2222/parse' -d "{\"q\": $line}"  -H 'Content-Type: application/json; charset=utf-8' >> report.log 2>>report.err
echo '' >> report.log 2>>report.err
done