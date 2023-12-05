<template>
  <div class="completion">
    <h3>Complete Incident</h3>
    <button @click="completeIncident" :disabled="isCompleting">
      {{ isCompleting ? 'Completing...' : 'Mark as Complete' }}
    </button>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  props: {
    incident: Object,
  },
  data() {
    return {
      isCompleting: false,
    };
  },
  methods: {
    async completeIncident() {
      try {
        this.isCompleting = true;
        // Assume you have an API endpoint to mark an incident as complete
        // Replace the URL with your actual endpoint
        const response = await axios.put(`http://your-api-endpoint/incidents/${this.incident.sys_id}/complete`);
        console.log(response.data);
        // Emit an event to indicate that the incident has been completed
        this.$emit('incidentCompleted');
      } catch (error) {
        console.error('Error completing the incident:', error);
        alert('There was an error completing the incident.');
      } finally {
        this.isCompleting = false;
      }
    },
  },
};
</script>


<style>


</style>