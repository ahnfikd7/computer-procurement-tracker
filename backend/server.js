// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const cors = require('cors');
const accessToken = 'JEWwpQriJXxBbT9PEANazgkzVsAROxn17TnsuyYYSQhF7lLwWwhDTfMQHYnzeFjPWMkaVry-CV99EPVkfXHGdg'; // Ideally fetched dynamically



const getServiceNowIncident = async (incidentNumber) => {
   const apiUrl = `https://harvardtest.service-now.com/api/now/table/incident?sysparm_limit=1&number=${incidentNumber}`;


   try {
       const response = await axios.get(apiUrl, {
           headers: {
               'Authorization': `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
           }
       });
       console.log("Direct API Response:", response.data); // Log direct API response
       
    
    const incidentData = response.data.result[0]; // Assuming result is an array and you need the first object
    console.log("Incident Data:", incidentData);
    
    if (!incidentData.assigned_to || !incidentData.assigned_to.value) {
        console.error("Assigned to information is missing in the incident.");
        return incidentData; // Or handle this scenario appropriately
    }
    
       return response.data.result; 
   } catch (error) {
       console.error('Error fetching incident:', error);
       throw error;
   }
};


const getServiceNowUser = async (userId) => {
    console.log("getServiceNowUser called with userId:", userId);

    const userApiUrl = `https://harvardtest.service-now.com/api/now/table/sys_user?sysparm_limit=1&sys_id=${userId}`;

    try {
        const response = await axios.get(userApiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data.result[0] || response.data.result[0].length === 0) {
            console.error("No incidents found in the response.");
            return null; // Or handle this scenario appropriately
        }
        

        // Check if the response has any results and extract the name
        if (response.data.result[0]) {
            console.log("Name of user: " + response.data.result[0].name)
            return response.data.result[0].name; // Return the name of the first user in the results
        } else {
            return 'Unknown'; // Default name if user is not found or result is empty
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};



const getServiceNowUserIdByName = async (technicianName) => {
    const userApiUrl = `https://harvardtest.service-now.com/api/now/table/sys_user?sysparm_limit=1&name=${technicianName}`;

    try {
        const response = await axios.get(userApiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.result[0]) {
            return response.data.result[0].sys_id;
        } else {
            return null; // User not found
        }
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
        const incident = await getServiceNowIncident('INC05184397');
        console.log("Fetched Incident:", incident); // Log after fetching
        console.log("Incident assigned value", incident[0].assigned_to.value);

        if (incident[0].assigned_to && incident[0].assigned_to.value) {
            const assignedUserName = await getServiceNowUser(incident[0].assigned_to.value);
            console.log("Assigned user name:", assignedUserName);
            incident[0].assigned_to_name = assignedUserName;
            console.log("Updated Incident data:", incident);
        }
        res.json(incident);
    } catch (error) {
        console.error("Error in /api/incidents:", error);
        res.status(500).json({ message: error.message });
    }
});


app.put('/api/incidents/:incidentSysId', async (req, res) => {
    const incidentSysId = req.params.incidentSysId;
    const technicianName = req.body.technicianName;

    try {
        const technicianSysId = await getServiceNowUserIdByName(technicianName);
        if (!technicianSysId) {
            return res.status(404).send('Technician not found');
        }

        // Update the incident
        await axios.put(`https://harvardtest.service-now.com/api/now/table/incident/${incidentSysId}`, {
            assigned_to: technicianSysId
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Fetch the updated incident data
        const updatedIncidentResponse = await axios.get(`https://harvardtest.service-now.com/api/now/table/incident/${incidentSysId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Return the updated incident data
        res.json(updatedIncidentResponse.data);
    } catch (error) {
        console.error('Error updating incident:', error);
        res.status(500).json({ message: error.message });
    }
});





app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});
