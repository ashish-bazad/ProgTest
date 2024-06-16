# Explo Project

## Steps to setup :

#### 1. Fork the repository, and clone the forked repository.
#### 2. Install the dependancies using following commands :
## Windows
##### Step 1 : Install Python from the Microsoft Store
```yaml
python
```
##### Step 2 : Run the following commands in the "explo" directory
```yaml
python -m venv env
Set-ExecutionPolicy -Scope Process Bypass
.\env\Scripts\Activate
pip install -r requirements.txt
```
##### Step 3 : Download and Install NodeJs from https://nodejs.org/ . After Installing run these commands to run the frontend from the "explo" directory
```yaml
cd frontend
npm install
npm run dev
```
##### Step 4 : Open another terminal window in the explo project directory and run these commands to run the backend from the "explo" directory
##### Note : Enter superuser details to create the superuser.
```yaml
Set-ExecutionPolicy -Scope Process Bypass
.\env\Scripts\Activate
cd backend
python .\manage.py makemigrations
python .\manage.py migrate
python .\manage.py createsuperuser
python .\manage.py runserver
```

## Ubuntu
##### Running Frontend from the "explo" directory
```yaml
sudo apt-get install python3-pip
sudo pip3 install virtualenv
virtualenv env
source env/bin/activate
pip install -r requirements.txt
sudo apt install nodejs npm
cd frontend
npm install
npm run dev
```
##### Running Backend from the "explo" directory
##### Note : Enter superuser details to create the superuser.
```yaml
source env/bin/activate
cd backend
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver
```

## Mac

##### Running Frontend from the "explo" directory
```yaml
sudo pip3 install virtualenv
virtualenv env
source env/bin/activate
pip3 install -r requirements.txt
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
cd frontend
npm install
npm run dev
```
##### Running Backend from the "explo" directory
##### Note : Enter superuser details to create the superuser.
```yaml
source env/bin/activate
cd backend
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver
```

## Assign Superuser Role to Users
After running the backend and frontend, go to 127.0.0.1:8000/admin and login with the created super user credentials, and then assign super user status to the user to which you want to assign the super user role

#### This is necessary as, to access the Teacher page of the frontend, you need to be a superuser i.e to create, delete and add quizzes.

### Here's how to do it
##### Step 1: Login with admin credentials
<img width="1440" alt="Screenshot 2024-04-10 at 10 39 17 PM" src="https://github.com/ashish-bazad/explo/assets/119102832/f239749c-6c4a-43fb-8821-9f98df8a485d">

##### Step 2: Go to Users table
<img width="1440" alt="Screenshot 2024-04-10 at 10 40 14 PM" src="https://github.com/ashish-bazad/explo/assets/119102832/2116e79e-ac5f-4538-8c73-5b1bd6c71bdd">

##### Step 3: Select any user
<img width="1440" alt="Screenshot 2024-04-10 at 10 41 47 PM" src="https://github.com/ashish-bazad/explo/assets/119102832/66b494c7-42db-4b6a-a479-4d884646ae65">

##### Step 4: Tick Superuser status
<img width="1440" alt="Screenshot 2024-04-10 at 10 42 54 PM" src="https://github.com/ashish-bazad/explo/assets/119102832/77ed943b-9cd2-4548-8506-2678a132034d">

##### Step 5: Scroll to the bottom and save the changes
<img width="1440" alt="Screenshot 2024-04-10 at 10 44 55 PM" src="https://github.com/ashish-bazad/explo/assets/119102832/c9c2b5be-3577-413c-b0a7-dd71e70a5009">

##### Step 6: Logout and you're good to gooooo!!
<img width="1440" alt="Screenshot 2024-04-10 at 10 46 16 PM" src="https://github.com/ashish-bazad/explo/assets/119102832/34f7bc02-6715-4973-a330-b60f8a9a73b9">


