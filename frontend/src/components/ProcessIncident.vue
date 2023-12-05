<template>
    <div class="process-incident">
      <h3>Process Incident</h3>
      <!-- You might want to add more UI elements here to process the incident -->
      <button @click="processIncident" :disabled="isProcessing">
        {{ isProcessing ? 'Processing...' : 'Mark as Processing' }}
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
        isProcessing: false,
      };
    },
    methods: {
      async processIncident() {
        try {
          this.isProcessing = true;
          // Replace the URL and method with your actual API endpoint and method
          const response = await axios.patch(`https://harvardtest.service-now.com/incidents/${this.incident.sys_id}`, {
            status: 'processing', // Update the status accordingly
          });
          console.log(response.data);
          this.$emit('stepCompleted', 3); // Assuming the next step is 3
        } catch (error) {
          console.error('Error processing incident:', error);
          alert('There was an error processing the incident.');
        } finally {
          this.isProcessing = false;
        }
      },
    },
  };
  </script>
 
  <style>
 
  </style>