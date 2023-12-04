<template>
    <div class="technician-assigner">
      <h3>Assign Technician</h3>
      <div class="update-form">
        <input v-model="technicianName" placeholder="Enter new technician name" class="update-input">
        <button @click="assignTechnician" class="update-button">Assign Technician</button>
      </div>
    </div>
  </template>
  
 
<script>
import axios from 'axios';
export default {
  props: {
    incident: Object
  },
  data() {
    return {
      technicianName: ''
    };
  },
  methods: {
    async assignTechnician() {
      if (!this.technicianName) {
        alert('Please enter a technician name.');
        return;
      }
      try {
        // API call to assign technician
        await axios.put(`https://harvardtest.service-now.com/api/incidents/${this.incident.sys_id}`, {
          technician: this.technicianName
        });
        this.$emit('stepCompleted', 2);
      } catch (error) {
        console.error('Error assigning technician:', error);
      }
    }
  }
};
</script>
  
  <style>
  .technician-assigner {
    /* Add your CSS styles here */
  }
  </style>
  