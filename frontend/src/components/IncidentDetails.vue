<template>
  <div v-if="incident" class="incident-details">
    <h2 class="details-title">Incident Details</h2>
    <div class="details-content">
      <p><strong>Number:</strong> {{ incident.number }}</p>
      <p><strong>Description:</strong> {{ incident.short_description }}</p>
      <p><strong>Status:</strong> {{ incident.state }}</p>
      <p><strong>Created On:</strong> {{ incident.sys_created_on }}</p>
      <p><strong>Updated On:</strong> {{ incident.sys_updated_on }}</p>
      <p><strong>Priority:</strong> {{ incident.priority }}</p>
      <p><strong>Assigned To:</strong> {{ incident.assigned_to_name }}</p>
    </div>

    <div class="update-form">
      <input v-model="newTechnician" placeholder="Enter new technician name" class="update-input">
      <button @click="updateTechnician" class="update-button">Update Technician</button>
    </div>
    <button @click="startProcessing">Start Processing</button>
    <button @click="notifyCustomer">Notify Customer</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    incident: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      newTechnician: ''
    };
  },
  methods: {
 


  async updateTechnician() {
  if (!this.newTechnician) {
    alert('Please enter technician name.');
    return;
  }
  try {
    const response = await axios.put(`http://localhost:3000/api/incidents/${this.incident.sys_id}`, {
      technicianName: this.newTechnician
    });
    console.log(response.data);
    this.$emit('technicianUpdated', this.newTechnician); // Emit an event to the parent component
  } catch (error) {
    console.error('Error updating technician:', error);
  }
}

  }
};
</script>

<style>
.incident-details {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  text-align: left;
}

.details-title {
  color: #333;
  margin-bottom: 15px;
}

.details-content > p {
  margin: 5px 0;
}

.update-form {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.update-input {
  padding: 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.update-button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.update-button:hover {
  background-color: #45a049;
}
</style>
