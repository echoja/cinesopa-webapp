cd ~/cinesopa-webapp
sudo docker-compose down
git pull
sudo docker pull eszqsc112/cinesopa:latest
sudo docker-compose up --build -d
