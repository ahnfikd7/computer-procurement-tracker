// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const cors = require('cors');


const getServiceNowIncident = async (incidentNumber) => {
   const apiUrl = `https://harvardtest.service-now.com/api/now/table/incident?sysparm_limit=1&number=${incidentNumber}`;
   const accessToken = 'pjaCuhzu6ZRLMl-H4MI6tiqPDhhyJ8gVQmSto6BiRpUUm38tpCaPj8eawofUangIVGEk3idbIYdMITN_u6xEQA'; // Ideally fetched dynamically

   try {
       const response = await axios.get(apiUrl, {
           headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
           }
       });
       return response.data.result; // Array of incidents
   } catch (error) {
       console.error('Error fetching incident:', error);
       throw error;
   }
};


const getServiceNowUser = async (userId) => {
   // Construct the URL to the user endpoint
   const userApiUrl = `https://harvardtest.service-now.com/api/now/table/sys_user/${userId}`;
 
   try {
     const response = await axios.get(userApiUrl, {
       headers: {
         'Authorization': `Bearer ${accessToken}`,
         'Content-Type': 'application/json'
       }
     });
     return response.data.result;
   } catch (error) {
     console.error('Error fetching user:', error);
     throw error;
   }
 };

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => res.send('Procurement Tracker Backend'));

app.get('/oauth/callback', async (req, res) => {
   const authCode = req.query.code;
   const state = req.query.state;

   if (!authCode) {
       return res.status(400).send('Authorization code not found');
   }

   try {
       // Exchange the authorization code for an access token
       const tokenResponse = await axios.post('https://harvardtest.service-now.com/oauth_token.do', {
           grant_type: 'authorization_code',
           code: authCode,
           redirect_uri: 'http://localhost:3000/oauth/callback',
           client_id: '0aa3b2fe8ba67110990ddcf10f5b5d2d',
           client_secret: 'Z4J<F}tCud'
       }, {
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
           }
       });

       // TODO: Handle the access token (store it, use it for subsequent requests, etc.)
       const accessToken = tokenResponse.data.access_token;

       console.log(accessToken)

       // Redirect or respond based on your application's requirement
       res.send('Authentication successful!'); // or redirect to another page
   } catch (error) {
       console.error('Error during token exchange:', error);
       res.status(500).send('Internal Server Error');
   }
});




app.get('/api/incidents', async (req, res) => {
   try {
       const incident = await getServiceNowIncident('INC05091001'); // Example incident number
       if (incident.assigned_to && incident.assigned_to.value) {
         const assignedUser = await getServiceNowUser(incident.assigned_to.value);
         incident.assigned_to_name = assignedUser.name; // Assuming 'name' is the field you want
       }
       res.json(incident);
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
});

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});
