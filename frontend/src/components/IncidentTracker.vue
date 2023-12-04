<template>
  <div class="tracker-container">
    <h1 class="tracker-title">Incident Tracker</h1>
    <div v-if="loading" class="loading">Loading incidents...</div>
    <ul v-else class="incident-list">
      <li v-for="incident in incidents" :key="incident.sys_id" @click="selectIncident(incident)" class="incident-item">
        {{ incident.short_description }} - Status: {{ incident.state }}
      </li>
    </ul>
    <IncidentDetails v-if="selectedIncident" :incident="selectedIncident" @technicianUpdated="handleTechnicianUpdate"/>
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
      this.selectedIncident = incident;
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
}

.incident-item {
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.incident-item:hover {
  background-color: #e9e9e9;
}

.loading, .no-incidents {
  text-align: center;
}
</style>
