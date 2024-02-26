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
                <a href="/"><i class="fas fa-home me-2"></i>Home</a>
              </li>
              <!-- <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-shopping-cart me-1"></i>
                Orders
              </li> -->
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

    <EditableNoteModal
      :show="showModal"
      :selectedEvent="selectedEvent"
      :clickedEvent="clickedEvent"
      @close-modal="closeModal"
      :modalTitle="modalTitle"
      @event-color-updated="handleEventColorUpdated"
      @date-marked-maintenance-activity-created="populateCalendarNew"
      @maintenance-activity-note-updated="populateCalendarNew"
      @maintenance-activity-deleted="populateCalendarNew"
    />
  </div>
</template>
<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import EditableNoteModal from "../../components/machine_maintenance/EditableNoteModal.vue";

export default {
  components: {
    FullCalendar,
    EditableNoteModal,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        events: [],
        eventClick: this.handleEventClick,
      },
      maintenance_plans: {},
      lines: [],
      selectedLine: "",
      selectedMachine: "",
      selectedDate: null,
      selectedEvent: {},
      showModal: false,
    };
  },
  methods: {
    getData() {
      console.log("info of logged in user", this.$store.state.user);
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
    // populateCalendar() {
    //   // Convert maintenance plans array into an array of event objects
    //   console.log(" isnide poplate calendar");
    //   const events = this.maintenance_plans.map((plan) => {
    //     let title = ""; // Default event title
    //     let color = ""; // Default event color
    //     let note = ""; // Default note
    //     let created_by_email = ""; // Default created_by email

    //     if (plan.maintenance_activity_type) {
    //       title = plan.maintenance_activity_type.code;
    //     }

    //     // Determine event color based on the presence of maintenance activities
    //     if (
    //       plan.maintenance_activities &&
    //       plan.maintenance_activities.length > 0
    //     ) {
    //       color = "green"; // Set event color to green if maintenance activities present
    //       note = plan.maintenance_activities
    //         .map((activity) => activity.note)
    //         .join("\n");

    //       // Get created_by email from the first maintenance activity
    //       if (plan.maintenance_activities[0].created_by) {
    //         created_by_email = plan.maintenance_activities[0].created_by.email;
    //       }
    //     } else {
    //       color = "orange"; // Set event color to orange if maintenance activities are empty
    //       // If there are no maintenance activities, set created_by email to the creator of the maintenance plan
    //       if (plan.created_by) {
    //         created_by_email = plan.created_by.email;
    //       }
    //     }

    //     return {
    //       id: plan.id,
    //       title: title,
    //       start: plan.maintenance_date,
    //       color: color,
    //       extendedProps: { note: note },
    //       created_by_userMail: created_by_email,
    //     };
    //   });

    //   // Update the calendar options with the events
    //   this.calendarOptions.events = events;
    // },
    populateCalendar() {
      // Convert maintenance plans array into an array of event objects
      console.log("Inside populate calendar");
      const events = this.maintenance_plans.map((plan) => {
        let title = ""; // Default event title
        let color = ""; // Default event color
        let note = ""; // Default note
        let created_by_email = ""; // Default created_by email
        let created_by_firstName = "";
        let created_at_info = "";

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

          // Get created_by email from the first maintenance activity
          if (
            plan.maintenance_activities[0].created_by &&
            plan.maintenance_activities[0].created_at
          ) {
            created_by_email = plan.maintenance_activities[0].created_by.email;
            created_by_firstName =
              plan.maintenance_activities[0].created_by.first_name;
            created_at_info = plan.maintenance_activities[0].created_at;
          }
        } else {
          color = "orange"; // Set event color to orange if maintenance activities are empty
          // If there are no maintenance activities, set created_by email to the creator of the maintenance plan
          if (plan.created_by) {
            created_by_email = plan.created_by.email;
            created_by_firstName = plan.created_by.first_name;
            created_at_info = plan.created_at;
          }
        }

        return {
          title: title,
          start: plan.maintenance_date,
          color: color,

          extendedProps: {
            id: plan.id,
            note: note,
            color: color,
            maintenance_plan_date: plan.maintenance_date,
            created_by_userMail: created_by_email,
            created_by_name: created_by_firstName,
            created_at: created_at_info,
          },
        };
      });

      // Update the calendar options with the events
      this.calendarOptions.events = events;
    },

    handleEventClick(info) {
      console.log("inside event click");
      console.log("info:", info);
      console.log("info.dateStr:", info.dateStr);

      console.log(info.event.id);

      const clickedEventStartDate = info.event.start;

      console.log("clicked event start date", clickedEventStartDate);

      // Convert clicked event start date to a date string without time component
      // const formattedClickedEventStartDate = clickedEventStartDate
      //   .toISOString()
      //   .split("T")[0];
      const formattedClickedEventStartDate =
        clickedEventStartDate.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
      const dateOnly = formattedClickedEventStartDate.split(",")[0]; // Extracting the date part

      const [day, month, year] = dateOnly
        .split("/")
        .map((part) => part.padStart(2, "0")); // Splitting the date parts and adding leading zeros if necessary
      const formattedDate = `${year}-${month}-${day}`; // Rearranging and joining parts
      console.log(formattedDate);

      const clickedDate = new Date(formattedDate);

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
      // const clickedEvent = this.calendarOptions.events.find(
      //   (event) => event.start === info.dateStr
      // );
      const eventsOnSameDate = this.calendarOptions.events.filter((event) => {
        // Extract the date part without time component from the event's start date
        const eventStartDate = event.start;

        // Compare the dates without time component
        return eventStartDate === formattedDate;
      });

      console.log("events on same date", eventsOnSameDate);

      const clickedEvent = eventsOnSameDate.find(
        (event) => event.extendedProps.id === info.event.extendedProps.id
      );
      console.log("clickedEvent", clickedEvent);

      // If event found
      if (clickedEvent) {
        console.log("this is clicked event=", clickedEvent);

        if (clickedEvent.color === "orange") {
          // Allow modification for the first time
          this.modifyEvent(clickedEvent);
        } else if (clickedEvent.color === "green") {
          // Check if the user who clicked the event is the creator of the maintenance activity
          if (
            this.$store.state.user.email ===
            clickedEvent.extendedProps.created_by_userMail
          ) {
            // Allow modification if the user is the creator
            this.modifyEvent(clickedEvent);
          } else {
            // Show alert that only the creator can modify the event
            window.alert(
              "Only the creator of the maintenance activity can modify it."
            );
          }
        }
      }
    },

    modifyEvent(clickedEvent) {
      // Check if the event is already green and a note exists

      //   if(clickedEvent.color==="green")
      if (
        clickedEvent.extendedProps.color === "orange" &&
        clickedEvent.extendedProps.note === ""
      ) {
        // First time modification, no note exists
        this.selectedEvent = clickedEvent;
        // Set modal title
        this.toggleModal(clickedEvent);
      } else if (
        clickedEvent.extendedProps.color === "green" &&
        clickedEvent.extendedProps.note !== null
      ) {
        this.selectedEvent = clickedEvent;

        this.toggleModal(clickedEvent);
      }
    },
    toggleModal(clickedEvent) {
      const modalTitle =
        clickedEvent.extendedProps.color === "orange" &&
        !clickedEvent.extendedProps.note
          ? "Add Note"
          : "Edit Note";

      this.showModal = !this.showModal;
      this.modalTitle = modalTitle;
    },
    closeModal() {
      console.log("inside close modal parent");
      this.showModal = false;

      // Set showModal to false to hide the modal
    },
    populateCalendarNew(data) {
      this.maintenance_plans = data;
      this.populateCalendar();
    },

    handleEventColorUpdated(updatedEventData) {
      console.log("inside event color update", updatedEventData);
      // Check if this.events is defined and not null
      const events = this.calendarOptions.events;
      //   if (!this.events) {
      //     console.error("this.events is not defined or null");
      //     return;
      //   }

      const eventToUpdate = events.find(
        (event) => event.id === updatedEventData.eventId
      );
      if (eventToUpdate) {
        console.log("print eventToUpdate", eventToUpdate);
        eventToUpdate.color = updatedEventData.newColor;
        if (updatedEventData.createdNote !== undefined) {
          eventToUpdate.extendedProps.note = updatedEventData.createdNote;
        }
      } else {
        console.error("Event not found in events array");
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
    // modifyEvent(clickedEvent) {
    //   // Check if the event is already green and a note exists
    //   if (clickedEvent.color === "green" && clickedEvent.extendedProps.note) {
    //     this.selectedEvent = clickedEvent;

    //     this.toggleModal();

    //     // Show the existing note to the user
    //     // window.alert("Existing note: " + clickedEvent.extendedProps.note);

    //     // Ask the user if they want to modify the existing note
    //     // const confirmModifyExistingNote = confirm(
    //     //   "Do you want to modify the existing note?"
    //     // );
    //     // if (!confirmModifyExistingNote) {
    //     //   return; // Exit function if the user chooses not to modify the existing note
    //     // }
    //   }

    //   // Prompt for additional note
    //   //   const note = prompt(
    //   //     "Enter additional note for this maintenance activity on " +
    //   //       clickedEvent.start +
    //   //       ":"
    //   //   );

    //   // Check if the prompt was cancelled
    //   //   if (note === null) {
    //   //     return; // Exit function if the prompt was cancelled
    //   //   }

    //   // Select the event
    //   //   clickedEvent.color = "green";
    //   //   clickedEvent.extendedProps.note = note.trim(); // Allow empty note
    //   //   this.selectedEvent = {
    //   //     maintenancePlanId: clickedEvent.id,
    //   //     start: clickedEvent.start,
    //   //     note: clickedEvent.extendedProps.note,
    //   //   };
    //   //   console.log("selected event", this.selectedEvent);
    //   //   this.MarkDate(); // Call MarkDate function for non-green events
    // },
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped></style>
