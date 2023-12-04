<template>
    <div class="customer-notification">
      <h3>Notify Customer</h3>
      <button @click="notifyCustomer" :disabled="isNotifying">
        {{ isNotifying ? 'Sending...' : 'Send Notification' }}
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
        isNotifying: false,
      };
    },
    methods: {
      async notifyCustomer() {
        try {
          this.isNotifying = true;
          // Replace with your actual logic to send a notification
          // This could be an email, SMS, or any other notification system
          // For example, using axios to send a POST request to your backend:
          const response = await axios.post(`http://your-api-endpoint/notifications`, {
            incidentId: this.incident.sys_id,
            // other necessary data
          });
          console.log(response.data);
          // Emit an event to indicate that the notification has been sent and to move to the next step
          this.$emit('stepCompleted', 4); // Assuming the next step is 4
        } catch (error) {
          console.error('Error sending customer notification:', error);
          alert('There was an error sending the notification to the customer.');
        } finally {
          this.isNotifying = false;
        }
      },
    },
  };
  </script>
  
  <style>
 
  </style>
  