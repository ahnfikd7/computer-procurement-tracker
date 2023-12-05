<template>
  <div class="tracker-container">
    <h1 class="tracker-title">Computer Procurement Tracker</h1>
    <div v-if="loading" class="loading">Loading incidents...</div>
    <ul v-else class="incident-list">
      <li v-for="incident in incidents" :key="incident.sys_id" @click="selectIncident(incident)" class="incident-item">
        {{ incident.short_description }} - Status: {{ incident.state }}
      </li>
    </ul>
    <IncidentDetails v-if="selectedIncident" :incident="selectedIncident" @technicianUpdated="handleTechnicianUpdate" @statusChange="handleStatusChange"/>
  </div>
</template>



<script>
import axios from 'axios';
import IncidentDetails from './IncidentDetails.vue';

export default {
  data() {
    return {
      incidents: [],
      loading: false,
      selectedIncident: null
    };
  },
  mounted() {
    this.fetchIncidents();
  },
  methods: {
    async fetchIncidents() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/incidents');
        this.incidents = response.data;
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        this.loading = false;
      }
    },

    handleStatusChange(newStatus) {
    if (this.selectedIncident) {
      // Update the status on the selected incident
      this.selectedIncident.currentStatus = newStatus;
      // Make an API call to update the status in the backend if necessary
      this.updateIncidentStatus(this.selectedIncident.sys_id, newStatus);
    }
  },

  async updateIncidentStatus(incidentId, newStatus) {
    try {
      // Assuming you have an endpoint that accepts PATCH or PUT requests to update the incident
      const response = await axios.patch(`http://localhost:3000/api/incidents/${incidentId}`, {
        currentStatus: newStatus
      });

      // Handle the response, e.g., updating the local state or notifying the user
      console.log('Incident status updated:', response.data);

      // If you need to update the local incident data with the response
      this.selectedIncident = { ...this.selectedIncident, ...response.data };
    } catch (error) {
      console.error('Error updating incident status:', error);
      // Handle error, e.g., show error message to the user
    }
  },

    handleTechnicianUpdate(newTechnicianName) {
  if (this.selectedIncident) {
    // Update the whole incidents array to trigger reactivity
    this.incidents = this.incidents.map(incident => {
      if (incident.sys_id === this.selectedIncident.sys_id) {
        return { ...incident, assigned_to_name: newTechnicianName };
      }
      return incident;
    });

    // Update selectedIncident
    this.selectedIncident = { 
      ...this.selectedIncident, 
      assigned_to_name: newTechnicianName 
    };
  }
},


    selectIncident(incident) {
      this.selectedIncident = { ...incident, currentStatus: 1 };
    }
  },
  components: {
    IncidentDetails
  }
};
</script>

<style>
.tracker-container {
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f4f4f4;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tracker-title {
  color: #333;
  text-align: center;
}

.incident-list {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}

.incident-item {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.incident-item:hover {
  background-color: #e9e9e9;
  transform: scale(1.02);
}

.loading, .no-incidents {
  text-align: center;
}


</style>