- The detailed explanation of how to solve the task has been sent in a separate Word document
# Revision Keeper
Revision Keeper is a tool that allows operators to upload CSV files containing patient data and outcomes. The uploaded data is displayed in an interactive table that can be sorted by multiple columns.

## Features:
- CSV Upload: Operators can upload CSV files with columns "Patient ID" and "Outcome."

- Error Handling: If the file is malformed, a friendly error message is displayed, and the file is rejected.

- Table Display: The uploaded data is shown in a table with three columns: Date/Time, Patient ID, Outcome.

- Sorting: The table can be sorted by any combination of the two columns: "Sort by" and "Then by."

- Recent Data Highlighting: If a patient has multiple outcomes, only the most recent outcome is displayed normally. Older entries are struck through and grayed out.

##  Getting started- IT person setup
 1. Install Dependencies:
Make sure that Node.js and npm are installed on the Ubuntu server. You can install them using the following commands:
```
sudo apt update
sudo apt install nodejs npm
```
2. Clone the Repository from GitHub:
Clone the repository from GitHub to the server. Replace the URL with the actual URL of your repository:
```
git clone https://github.com/HadarPinchasi/PatientWeb.git
cd PatientWeb
cd backend
```
3. Install the Dependencies:
After cloning the repository, install the necessary dependencies defined in the package.json file:
```
npm install
```
4. Start the Application:
You can now start the Node.js server. Run the following command to start the application:
```
npm start
```
By default, the server will run on port 3001 and listen on all network interfaces, allowing access from other computers in the same network.
5. Accessing the Application

##### From the same machine (local access):
Open a web browser and go to:
```
http://localhost:3001/
```
##### From another computer on the network:
1. Find the server's IP address by running:
```
ip a
```
Look for an IP address like 192.168.x.x.


2. From another computer on the same network, open a web browser and enter:
```
http://<server-ip>:3001/
```
(Replace <server-ip> with the actual IP address of the machine running the server.)

6. Firewall Configuration (If Needed)
If the server is not accessible from another computer, ensure that the firewall allows connections on port 3001:
```
sudo ufw allow 3001
```
