<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <div
      class="spinner-border mt-5"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>
      <b> Loading... </b>
    </div>
  </div>
  <div v-else class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Maintenance Calendar</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-shopping-cart me-1"></i>
                Orders
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 d-flex justify-content-end mt-4">
        <select v-model="selectedMachine" @change="selectMachine">
          <option disabled value="">Select Machine</option>
          <option
            v-for="machine in machines"
            :key="machine.id"
            :value="machine"
          >
            {{ machine.name }}
          </option>
        </select>
        <router-link
          to="/machine/create-maintenance-calendar"
          class="btn btn-primary btn-sm ms-2"
        >
          Create Maintenance Plan
        </router-link>
      </div>
    </div>
    <!-- Rest of your component -->
    <div style="margin-top: 50px">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
// import { Calendar } from "@fullcalendar/core";
import axios from "axios";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [multiMonthPlugin],
        initialView: "multiMonthYear",
        events: [],
        eventClick: function (info) {
          if (info.event.extendedProps && info.event.extendedProps.note) {
            alert(info.event.extendedProps.note); // Display note in an alert
          } else {
            alert("No note available for this event.");
          }
        },
      },

      machines: [],
      selectedMachine: "",
      marked_dates: {
        dates: [],
      },
      maintenance_plans: {},
    };
  },

  methods: {
    // redirectToMaintenanceCalendar() {
    //   // Navigate to the "/CreateMachineMaintenanceCalendar" page
    //   this.$router.push("/machine/create-maintenance-calendar");
    // },
    getData() {
      axios
        .get("machine-maintenance/get-machine-data/")
        .then((response) => {
          console.log(response.data);
          this.machines = response.data.machines;
          this.maintenance_activity_types =
            response.data.maintenance_activity_types;
        })
        .catch((error) => {
          console.log("error fetching data", error);
        });
    },
    fetchMaintenanceDates(machineId) {
      console.log("id of the machine selected", machineId);
      axios
        .post("machine-maintenance/get-maintenance-plan/", {
          machine_id: machineId,
        })
        .then((response) => {
          // console.log("this is response data", response.data);

          this.maintenance_plans = response.data.maintenance_plans;
          console.log("this is maintenance_plans ", this.maintenance_plans);
          this.populateCalendar();
        })
        .catch((error) => {
          console.error("Error fetching maintenance dates:", error);
        });
    },
    populateCalendar() {
      // Convert maintenance plans array into an array of event objects
      const events = this.maintenance_plans.map((plan) => {
        let title = ""; // Default event title
        let color = ""; // Default event color
        let note = ""; // Default note

        // Check if maintenance activity type code is 'D' or 'M'
        if (
          plan.maintenance_activity_type &&
          plan.maintenance_activity_type.code === "D"
        ) {
          title = "D"; // Set event title to 'D' for daily maintenance
        } else if (
          plan.maintenance_activity_type &&
          plan.maintenance_activity_type.code === "M"
        ) {
          title = "M"; // Set event title to 'M' for monthly maintenance
        }

        // Determine event color based on the presence of maintenance activities
        if (
          plan.maintenance_activities &&
          plan.maintenance_activities.length > 0
        ) {
          color = "green"; // Set event color to green if maintenance activities present
          note = plan.maintenance_activities
            .map((activity) => activity.note)
            .join("\n");
        } else {
          color = "orange"; // Set event color to orange if maintenance activities are empty
        }

        return {
          title: title,
          start: plan.maintenance_date,
          color: color,
          extendedProps: { note: note },
        };
      });

      // Update the calendar options with the events
      this.calendarOptions.events = events;
    },

    selectMachine() {
      console.log("inside select machine");
      console.log("Selected machine:", this.selectedMachine);
      if (this.selectedMachine) {
        this.fetchMaintenanceDates(this.selectedMachine.id);
      }
    },
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
// .full-calendar-event {
//   background-color: #007bff; /* Blue color for the event marker */
//   color: #fff; /* White text color */
//   padding: 4px 8px; /* Padding around the text */
//   border-radius: 50%; /* Rounded shape */
// }
</style>
