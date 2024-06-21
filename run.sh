

docker build -t roamtrips-be .
# docker run roamtrips-be:latest
docker tag roamtrips-be:latest public.ecr.aws/q5n8p2n2/roamtrips:roamtrips-be
docker push public.ecr.aws/q5n8p2n2/roamtrips:roamtrips-be

docker tag roamtrips-be:latest 055014602999.dkr.ecr.us-east-2.amazonaws.com/roamtrips:roamtrips-be

docker push 055014602999.dkr.ecr.us-east-2.amazonaws.com/roamtrips:roamtrips-be

# kubectl apply -f k8s.yaml
# kubectl apply -f k8s-service.yaml

# eksctl create cluster -f ekscluster.yaml

# eksctl create cluster --name testeks --region us-east-2 --fargate
# eksctl delete cluster --name testeks --region us-east-2



##test new jenkins server
