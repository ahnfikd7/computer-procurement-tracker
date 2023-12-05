<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  <div v-if="incident" class="incident-details">
    <h2 class="details-title">Incident Details</h2>
    <div class="status-bar">
      <div class="status-item" :class="{ 'active': incident.currentStatus === status.id }" v-for="status in incidentStatuses" :key="status.id">
        {{ status.label }}
      </div>
    </div>
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
      <button @click="updateTechnician" class="update-button">
        <i class="fas fa-tools"></i> Update Technician</button>
    </div>
     <!-- Processing and Notify Customer Buttons -->
     <div class="actions">
      <button @click="startProcessing" class="action-button">Start Processing</button>
      <button @click="notifyCustomer" class="action-button">Notify Customer</button>
      <button @click="markAsCompleted" class="action-button">Mark as Completed</button>

    </div>
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
      newTechnician: '',
      incidentStatuses: [
        { id: 1, label: 'Waiting to be Assigned' },
        { id: 2, label: 'Processing by Technician' },
        { id: 3, label: 'Waiting for Customer to Pickup' },
        { id: 4, label: 'Completed' }
      ]
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
  // this.updateStatus(2);
},
async startProcessing() {
      // Logic to send a notification to the customer
      try {
        // Placeholder for notification logic
        // this.$emit('customerNotified');
        this.updateStatus(2); // Update status to "Processing"
      } catch (error) {
        console.error('Error starting processing:', error);
      }
    },
async notifyCustomer() {
      // Logic to send a notification to the customer
      try {
        // Placeholder for notification logic
        // this.$emit('customerNotified');
        this.updateStatus(3); // Update status to "Waiting for Customer to Pickup"
      } catch (error) {
        console.error('Error notifying the customer:', error);
      }
    },
    markAsCompleted() {
    this.updateStatus(4); // Assuming 4 is the ID for "Completed" status
    // You can also implement additional logic here as needed
  },
    updateStatus(newStatus) {
      // Logic to update the status of the incident
      this.$emit('statusChange', newStatus);
      // Here you would make an API call to update the status in the backend as well
    }

  }
};
</script>

<style>
/* Base Styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
}

/* Incident Details Styles */
.incident-details {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 20px;
  margin-top: 30px;
  transition: all 0.3s ease;
}

.incident-details:hover {
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.details-title {
  color: #333;
  font-size: 1.5em;
  margin-bottom: 20px;
  font-weight: bold;
}

.details-content > p {
  margin: 10px 0;
  font-size: 1.1em;
  color: #555;
}

.update-form {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
}

.update-input {
  padding: 12px 15px;
  margin-right: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1em;
}

.update-button, .action-button {
  padding: 12px 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.update-button:hover, .action-button:hover {
  background-color: #0056b3;
}

.update-button i, .action-button i {
  margin-right: 8px;
}

/* Status Bar */
.status-bar {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  background-color: #eee;
  padding: 15px;
  border-radius: 10px;
}

.status-item {
  text-align: center;
  padding: 10px;
  flex-grow: 1;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-item i {
  margin-right: 5px;
}

.status-item.active {
  color: #007bff;
  font-weight: bold;
  transform: scale(1.1);
}

/* Actions */
.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .update-form, .actions {
    flex-direction: column;
  }

  .update-input, .update-button, .action-button {
    width: 100%;
    margin-top: 10px;
  }

  .status-bar {
    flex-direction: column;
  }

  .status-item {
    margin-bottom: 10px;
  }
}
</style>
