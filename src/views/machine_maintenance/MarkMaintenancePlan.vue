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
          <h2 class="mb-0">Mark Maintenance Dates</h2>
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
        <select v-model="selectedLine" @change="selectLine">
          <option disabled value="">Select Line</option>
          <option v-for="line in lines" :key="line.id" :value="line">
            {{ line.name }}
          </option>
        </select>
        <select class="ms-2" v-model="selectedMachine" @change="selectMachine">
          <option disabled value="">Select Machine</option>
          <option
            v-for="machine in filteredMachines"
            :key="machine.id"
            :value="machine"
          >
            {{ machine.name }}
          </option>
        </select>
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
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        events: [],
        dateClick: this.handleEventClick,
      },
      maintenance_plans: {},
      lines: [],
      selectedLine: "",
      selectedMachine: "",
      selectedDate: null,
      selectedEvents: {},
    };
  },
  methods: {
    getData() {
      axios
        .get("machine-maintenance/get-machine-data/")
        .then((response) => {
          console.log(response.data);
          this.lines = response.data.lines;
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
        // if (
        //   plan.maintenance_activity_type &&
        //   plan.maintenance_activity_type.code === "D"
        // ) {
        //   title = "D"; // Set event title to 'D' for daily maintenance
        // } else if (
        //   plan.maintenance_activity_type &&
        //   plan.maintenance_activity_type.code === "M"
        // ) {
        //   title = "M"; // Set event title to 'M' for monthly maintenance
        // }
        if (plan.maintenance_activity_type) {
          title = plan.maintenance_activity_type.code;
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
        // const createdUserEmails = plan.maintenance_activities.map(
        //   (activity) => activity.created_by.email
        // );
        // const updatedUserEmails = plan.maintenance_activities.map(
        //   (activity) => activity.updated_by.email
        // );
        var created_by = "";
        if (plan.maintenance_activities.length !== 0) {
          created_by = plan.maintenance_activities[0].created_by.email;
        }

        return {
          id: plan.id,
          title: title,
          start: plan.maintenance_date,
          color: color,
          extendedProps: { note: note },
          maintenance_activity_created_by_userMail: created_by,
        };
      });

      // Update the calendar options with the events
      this.calendarOptions.events = events;
    },
    //can modify multiple future dates from present day
    // handleEventClick(info) {
    //   console.log("inside event click");
    //   const clickedDate = info.dateStr;

    //   // Find all events with the clicked date
    //   const clickedEvents = this.calendarOptions.events.filter(
    //     (event) => event.start === clickedDate
    //   );

    //   console.log("clicked events = ", clickedEvents);

    //   // If events found, toggle their color between green and yellow
    //   if (clickedEvents.length > 0) {
    //     clickedEvents.forEach((event) => {
    //       // Check if the event is already selected
    //       const index = this.selectedEvents.findIndex(
    //         (selectedEvent) => selectedEvent.start === event.start
    //       );

    //       if (index === -1) {
    //         // Prompt for additional note
    //         const note = prompt(
    //           "Enter additional note for this maintenance activity on " +
    //             event.start +
    //             ":"
    //         );

    //         // Check if the prompt was cancelled
    //         if (note === null) {
    //           return; // Exit the loop if the prompt was cancelled
    //         }

    //         // If the event is not selected, add it to the selectedEvents array
    //         event.color = "green";
    //         event.extendedProps.note = note ? note.trim() : ""; // Allow empty note
    //         this.selectedEvents.push({
    //           maintenancePlanId: event.id,
    //           start: event.start,
    //           note: event.extendedProps.note,
    //         });
    //       } else {
    //         // If the event is already selected, remove it from the selectedEvents array
    //         this.selectedEvents.splice(index, 1);
    //         event.color = "orange";
    //       }
    //     });
    //   }
    //   console.log("selected events", this.selectedEvents);
    // },

    //can modify multiple  past days from the present day
    // handleEventClick(info) {
    //   console.log("inside event click");
    //   const clickedDate = new Date(info.dateStr);
    //   const currentDate = new Date(); // Get current date

    //   // Check if the clicked date is in the past or today
    //   if (clickedDate <= currentDate) {
    //     // Find all events with the clicked date
    //     const clickedEvents = this.calendarOptions.events.filter(
    //       (event) => event.start === info.dateStr
    //     );

    //     console.log("clicked events = ", clickedEvents);

    //     // If events found, toggle their color between green and yellow
    //     if (clickedEvents.length > 0) {
    //       clickedEvents.forEach((event) => {
    //         // Check if the event is already selected
    //         const index = this.selectedEvents.findIndex(
    //           (selectedEvent) => selectedEvent.start === event.start
    //         );

    //         if (index === -1) {
    //           // Prompt for additional note
    //           const note = prompt(
    //             "Enter additional note for this maintenance activity on " +
    //               event.start +
    //               ":"
    //           );

    //           // Check if the prompt was cancelled
    //           if (note === null) {
    //             return; // Exit the loop if the prompt was cancelled
    //           }

    //           // If the event is not selected, add it to the selectedEvents array
    //           event.color = "green";
    //           event.extendedProps.note = note ? note.trim() : ""; // Allow empty note
    //           this.selectedEvents.push({
    //             maintenancePlanId: event.id,
    //             start: event.start,
    //             note: event.extendedProps.note,
    //           });
    //         } else {
    //           // If the event is already selected, remove it from the selectedEvents array
    //           this.selectedEvents.splice(index, 1);
    //           event.color = "orange";
    //         }
    //       });
    //     }
    //     console.log("selected events", this.selectedEvents);
    //   } else {
    //     // Show alert that you cannot modify events on future dates
    //     window.alert("You cannot modify events on future dates.");
    //   }
    // },

    // un mark date funtioanlity
    // handleEventClick(info) {
    //   console.log("inside event click");
    //   const clickedDate = new Date(info.dateStr);
    //   const currentDate = new Date(); // Get current date

    //   // Check if the clicked date is not today
    //   if (
    //     clickedDate.getDate() !== currentDate.getDate() ||
    //     clickedDate.getMonth() !== currentDate.getMonth() ||
    //     clickedDate.getFullYear() !== currentDate.getFullYear()
    //   ) {
    //     // Show alert that you can only modify events for today
    //     window.alert("You can only modify events for today.");
    //     return;
    //   }

    //   // Find the clicked event
    //   const clickedEvent = this.calendarOptions.events.find(
    //     (event) => event.start === info.dateStr
    //   );

    //   // If event found, toggle its color between green and orange
    //   if (clickedEvent) {
    //     console.log("this is clicked event=", clickedEvent);

    //     if (clickedEvent.color === "green") {
    //       // If the event is already green, deselect it
    //       this.selectedEvent = {
    //         maintenancePlanId: clickedEvent.id,
    //       };
    //       console.log(
    //         "  inside maintenance plan",
    //         this.selectedEvent.maintenancePlanId
    //       );

    //       this.unmarkDate(clickedEvent); // Call unmarkDate function for green events
    //     } else {
    //       // Prompt for additional note
    //       const note = prompt(
    //         "Enter additional note for this maintenance activity on " +
    //           info.dateStr +
    //           ":"
    //       );

    //       // Check if the prompt was cancelled
    //       if (note === null) {
    //         return; // Exit function if the prompt was cancelled
    //       }

    //       // Select the event
    //       clickedEvent.color = "green";
    //       clickedEvent.extendedProps.note = note ? note.trim() : ""; // Allow empty note
    //       this.selectedEvent = {
    //         maintenancePlanId: clickedEvent.id,
    //         start: clickedEvent.start,
    //         note: clickedEvent.extendedProps.note,
    //       };
    //       console.log("selected event", this.selectedEvent);
    //       this.MarkDate(); // Call MarkDate function for non-green events
    //     }
    //   }
    // },
    handleEventClick(info) {
      console.log("inside event click");
      const clickedDate = new Date(info.dateStr);
      const currentDate = new Date(); // Get current date

      // Check if the clicked date is not today
      if (
        clickedDate.getDate() !== currentDate.getDate() ||
        clickedDate.getMonth() !== currentDate.getMonth() ||
        clickedDate.getFullYear() !== currentDate.getFullYear()
      ) {
        // Show alert that you can only modify events for today
        window.alert("You can only modify events for today.");
        return;
      }

      // Find the clicked event
      const clickedEvent = this.calendarOptions.events.find(
        (event) => event.start === info.dateStr
      );

      // If event found
      if (clickedEvent) {
        console.log("this is clicked event=", clickedEvent);

        // Compare the creator of the event with the current user
        if (
          clickedEvent.maintenance_activity_created_by_userMail !==
          this.$store.state.user.username
        ) {
          // Show alert that only the creator can modify the event
          window.alert("You can only modify events created by you.");
          return;
        }

        // Check if the event is already green and a note exists
        if (clickedEvent.color === "green" && clickedEvent.extendedProps.note) {
          // Show the existing note to the user
          window.alert("Existing note: " + clickedEvent.extendedProps.note);
        }

        if (clickedEvent.color !== "green") {
          // Prompt for additional note
          const note = prompt(
            "Enter additional note for this maintenance activity on " +
              info.dateStr +
              ":"
          );

          // Check if the prompt was cancelled
          if (note === null) {
            return; // Exit function if the prompt was cancelled
          }

          // Select the event
          clickedEvent.color = "green";
          clickedEvent.extendedProps.note = note ? note.trim() : ""; // Allow empty note
          this.selectedEvent = {
            maintenancePlanId: clickedEvent.id,
            start: clickedEvent.start,
            note: clickedEvent.extendedProps.note,
          };
          console.log("selected event", this.selectedEvent);
          this.MarkDate(); // Call MarkDate function for non-green events
        }
      }
    },

    MarkDate() {
      // Make API call using Axios
      console.log("create maintenance activity called");
      axios
        .post(
          "/machine-maintenance/create-or-delete-maintenance-activity",
          this.selectedEvent
        )
        .then((response) => {
          console.log("Response:", response.data);
          // Handle success response here
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error here
        });
    },

    unmarkDate(clickedEvent) {
      // Make API call to delete maintenance activity using Axios
      console.log("delete maintenance activity called");
      axios
        .delete("/machine-maintenance/create-or-delete-maintenance-activity", {
          data: this.selectedEvent,
        })
        .then((response) => {
          console.log("Maintenance activity deleted:", response.data);
          clickedEvent.color = "orange";
          this.selectedEvent = null; // Clear selected event
          // Handle success response here
        })
        .catch((error) => {
          console.error("Error deleting maintenance activity:", error);
          // Handle error here
        });
    },

    selectLine() {
      // Filter machines based on the selected line
      if (this.selectedLine) {
        this.filteredMachines = this.selectedLine.machines;
      } else {
        this.filteredMachines = []; // Reset the filtered machines if no line is selected
      }
      // Reset selected machine
      this.selectedMachine = null;
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

<style lang="scss" scoped></style>
