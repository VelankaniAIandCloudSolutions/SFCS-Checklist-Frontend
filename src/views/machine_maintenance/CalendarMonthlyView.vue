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
                <a href="/machine/calendar-yearly-view"
                  ><i class="far fa-calendar me-2"></i>Yearly View</a
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-calendar me-2"></i>
                Monthly View
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 d-flex justify-content-end mt-4">
        <select v-model="selectedLine" @change="selectLine">
          <option disabled value="">Select Line</option>
          <option
            v-for="line in lines"
            :key="line.id"
            :value="line"
            :selected="line.id === preselectedLineId"
          >
            {{ line.name }}
          </option>
        </select>
        <select class="ms-2" v-model="selectedMachine" @change="selectMachine">
          <option disabled value="">Select Machine</option>
          <option
            v-for="machine in filteredMachines"
            :key="machine.id"
            :value="machine"
            :selected="machine.id === preselectedMachineId"
          >
            {{ machine.name }}
          </option>
        </select>
        <router-link
          to="/machine/plan-creation"
          class="btn btn-primary btn-sm ms-2"
        >
          Create Maintenance Plan
        </router-link>
      </div>
    </div>
    <!-- Rest of your component -->

    <div class="card card-outline card-primary mt-5">
      <div class="card-header">
        <h3 class="card-title" style="font-weight: bold; font-size: 1.2em">
          Legend:
        </h3>
        <div class="card-tools">
          <!-- Buttons, labels, and many other things can be placed here! -->
          <!-- Here is a label for example -->
          <!-- <span class="badge badge-primary">Label</span> -->
        </div>
        <!-- /.card-tools -->
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <!-- Legends Container -->
        <div class="legends-container">
          <div class="legend-item">
            <div class="legend-color red"></div>
            <div class="legend-label">Maintenance Activity Due</div>
          </div>
          <div class="legend-item">
            <div class="legend-color yellow"></div>
            <div class="legend-label">Maintenance Activity Scheduled</div>
          </div>
          <div class="legend-item">
            <div class="legend-color green"></div>
            <div class="legend-label">Maintenance Activity Performed</div>
          </div>
        </div>

        <!-- FullCalendar Component -->
        <div style="margin-top: 50px">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>
      <!-- /.card-body -->

      <!-- /.card-footer -->
    </div>

    <MaintenancePlanDetailsModal
      :show="showPlanDetailsModal"
      :selectedEvent="selectedEvent"
      :clickedEvent="clickedEvent"
      @close-modal="closePlanDetailsModal"
      @maintenance-plan-deleted="populateCalendarNew"
      @maintenance-activity-deleted="populateCalendarNew"
    />
    <CreateMaintenancePlanModal
      :show="showCreateMaintenancePlanModal"
      :maintenanceActivityTypes="maintenance_activity_types"
      @close-modal="closeCreateMaintenancePlanModal"
      :maintenance-plan-info="maintenancePlanInfo"
      @maintenance-plan-created-by-clicking="populateCalendarNew"
    />
    <EditableNoteModal
      :show="showEditableModal"
      :selectedEvent="selectedEvent"
      :clickedEvent="clickedEvent"
      @close-modal="closeEditableNoteModal"
      :modalTitle="modalTitle"
      :selectedLineId="selectedLine"
      :selectedTypeId="selectedType"
      @event-color-updated="handleEventColorUpdated"
      @maintenance-plan-deleted="populateCalendarNew"
      @date-marked-maintenance-activity-created="populateCalendarNew"
      @maintenance-activity-updated="populateCalendarNew"
      @maintenance-activity-deleted="populateCalendarNew"
    />
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
// import multiMonthPlugin from "@fullcalendar/multimonth";
// import { Calendar } from "@fullcalendar/core";
import axios from "axios";
import MaintenancePlanDetailsModal from "../../components/machine_maintenance/MaintenancePlanDetailsModal.vue";
import CreateMaintenancePlanModal from "../../components/machine_maintenance/CreateMaintenancePlanModal.vue";
import EditableNoteModal from "../../components/machine_maintenance/EditableNoteModal.vue";

export default {
  props: ["lineId", "machineId"],

  components: {
    FullCalendar,
    MaintenancePlanDetailsModal,
    CreateMaintenancePlanModal,
    EditableNoteModal,
    // make the <FullCalendar> tag available
  },
  // computed:{
  //   filteredMachines(){
  //     return this.selectedLine.machines
  //   }
  // },
  data() {
    return {
      calendarOptions: {
        // plugins: [multiMonthPlugin],
        // initialView: "multiMonthYear",
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        events: [],
        eventClick: this.handleEventClick,
        // dateClick: this.handleDateClick, // for activity creation
        // dateClick: this.handleDateClick,
        // selectable: true,

        // select: this.handleDateSelect,
      },

      lines: [],

      selectedLine: "",
      selectedMachine: "",
      selectedEvent: {},
      showPlanDetailsModal: false,
      showCreateMaintenancePlanModal: false,
      maintenance_plans: {},
      maintenance_activity_types: [],
      maintenancePlanInfo: {},
      showEditableModal: false,
      filteredMachines: [],
    };
  },

  methods: {
    async getData() {
      await axios
        .get("machine-maintenance/get-machine-data/")
        .then((response) => {
          console.log(response.data);
          this.lines = response.data.lines;

          // Receive the query parameters from the URL
          const { lineId, machineId } = this.$route.query;
          console.log(lineId);
          console.log(machineId);
          // If both lineId and machineId are provided, select the corresponding line and machine
          if (lineId && machineId) {
            console.log("lines in if", this.lines);
            // Find the selected line based on lineId
            this.selectedLine = response.data.lines.find(
              (line) => line.id == lineId
            );
            this.selectLine();
            console.log("Selected Line:", this.selectedLine);

            // Find the selected machine based on machineId
            if (this.selectedLine) {
              this.selectedMachine = this.selectedLine.machines.find(
                (machine) => machine.id == machineId
              );
              console.log("Selected Machine:", this.selectedMachine);

              // If the selected machine is valid, fetch maintenance dates
              if (this.selectedMachine) {
                // this.fetchMaintenanceDates(this.selectedMachine.id);
                this.selectMachine();
              }
            }
          }

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
    //   console.log(" inside populate calendar");
    //   const events = this.maintenance_plans.map((plan) => {
    //     let title = ""; // Default event title
    //     let color = ""; // Default event color
    //     let note = ""; // Default note
    //     let created_by_email = ""; // Default created_by email
    //     let created_by_firstName = "";
    //     let created_at_info = "";

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
    //       if (
    //         plan.maintenance_activities[0].created_by &&
    //         plan.maintenance_activities[0].created_at
    //       ) {
    //         created_by_email = plan.maintenance_activities[0].created_by.email;
    //         created_by_firstName =
    //           plan.maintenance_activities[0].created_by.first_name;
    //         created_at_info = plan.maintenance_activities[0].created_at;
    //       }
    //     } else {
    //       color = "orange"; // Set event color to orange if maintenance activities are empty
    //       // If there are no maintenance activities, set created_by email to the creator of the maintenance plan
    //       if (plan.created_by) {
    //         created_by_email = plan.created_by.email;
    //         created_by_firstName = plan.created_by.first_name;
    //       }
    //     }

    //     return {
    //       id: plan.id,
    //       title: title,
    //       start: plan.maintenance_date,
    //       color: color,

    //       extendedProps: { note: note },
    //       created_by_userMail: created_by_email,
    //       created_by_name: created_by_firstName,
    //       created_at: created_at_info,
    //     };
    //   });

    //   // Update the calendar options with the events
    //   this.calendarOptions.events = events;
    // },
    populateCalendar() {
      console.log("Inside populate calendar");
      const today = new Date();
      console.log(today);

      const events = this.maintenance_plans.map((plan) => {
        let title = ""; // Default event title
        let color = ""; // Default event color
        let note = ""; // Default note
        let created_by_email = ""; // Default created_by email
        let created_by_firstName = "";
        let created_at_info = "";
        let is_completed = "";

        const maintenanceDate = new Date(plan.maintenance_date);
        maintenanceDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (plan.maintenance_activity_type) {
          title = plan.maintenance_activity_type.code;
        }

        if (
          plan.maintenance_activities &&
          plan.maintenance_activities.length > 0
        ) {
          // Get the status of the first maintenance activity
          is_completed = plan.maintenance_activities[0].is_completed;

          // Capture note regardless of completion status
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
        }

        // Set color based on maintenance date
        if (maintenanceDate < today) {
          color = is_completed ? "green" : "red";
          if (plan.maintenance_activities.length > 0) {
            created_by_email = plan.maintenance_activities[0].created_by.email;
            created_by_firstName =
              plan.maintenance_activities[0].created_by.first_name;
            created_at_info = plan.maintenance_activities[0].created_at;
          } else {
            created_by_email = plan.created_by.email;
            created_by_firstName = plan.created_by.first_name;
            created_at_info = plan.created_at;
          }
        } else if (
          maintenanceDate.getTime() === today.getTime() &&
          plan.maintenance_activities.length > 0
        ) {
          color = is_completed ? "green" : "red";
          created_by_email = plan.maintenance_activities[0].created_by.email;
          created_by_firstName =
            plan.maintenance_activities[0].created_by.first_name;
          created_at_info = plan.maintenance_activities[0].created_at;
        } else {
          color = "orange";
          created_by_email = plan.created_by.email;
          created_by_firstName = plan.created_by.first_name;
          created_at_info = plan.created_at;
        }

        return {
          title: title,
          start: plan.maintenance_date,
          color: color,

          extendedProps: {
            id: plan.id,
            note: note,
            color: color,
            maintenance_activity_completed: is_completed,
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
    // handleEventClick(info) {
    //   if (info.event.extendedProps && info.event.extendedProps.note) {
    //     alert(info.event.extendedProps.note); // Display note in an alert
    //   } else {
    //     alert("No note available for this event.");
    //   }
    // },

    // handleEventClick(info) {
    //   console.log("event clicked");
    //   console.log("info:", info);
    //   console.log("info.event:", info.event);

    //   // const clickedEvent = this.calendarOptions.events.find(
    //   //   (event) => event.start === info.dateStr
    //   // );
    //   const clickedEvent = info.event.def;
    //   console.log("dsdsdsd", clickedEvent);

    //   console.log("th=is is the clicked event", clickedEvent);

    //   if (clickedEvent) {
    //     this.selectedEvent = clickedEvent;

    //     console.log("this is clicked event=", clickedEvent);
    //     this.toggleModal(clickedEvent);
    //   }
    // },
    handleEventClick(info) {
      console.log("event clicked");
      console.log("info:", info);
      console.log("info.event:", info.event);

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

      const eventsOnSameDate = this.calendarOptions.events.filter((event) => {
        // Extract the date part without time component from the event's start date
        const eventStartDate = event.start;

        // Compare the dates without time component
        return eventStartDate === formattedDate;
      });

      console.log("events on same date", eventsOnSameDate);

      const existingEvent = eventsOnSameDate.find(
        (event) => event.extendedProps.id === info.event.extendedProps.id
      );
      console.log("existingEvent", existingEvent);

      const clickedDate = new Date(formattedDate);

      const currentDate = new Date();

      console.log("clicked date", clickedDate);
      console.log("current date is ", currentDate);

      if (clickedDate > currentDate) {
        // Show alert that you cannot edit activities in the future
        window.alert("You cannot edit activities in the future.");
        return;
      }

      if (existingEvent) {
        console.log("existing event for this date", existingEvent);
        // alert(`A maintenance plan already exists for ${info.dateStr}.`);

        if (
          existingEvent.extendedProps.color === "orange" ||
          existingEvent.extendedProps.color === "red"
        ) {
          this.modifyEvent(existingEvent);
        } else if (existingEvent.color === "green") {
          this.selectedEvent = existingEvent;
          console.log(
            "this is selected event passed as prop ",
            this.selectedEvent
          );

          this.togglePlanDetailsModal();
        }
      } else {
        // If there is no event for the clicked date, open a modal to create a new maintenance plan
        const maintenancePlanInfo = {
          selectedMachine: this.selectedMachine,
          selectedDate: info.dateStr,
        };
        this.maintenancePlanInfo = maintenancePlanInfo;

        this.toggleCreateMaintenancePlanModal();
      }

      // Perform further actions with the clicked event as needed
    },

    // handleDateClick(info) {
    //   if (info && info.dateStr) {
    //     console.log("Inside Date click, Selected Date:", info.dateStr);

    //     // Find the event for the clicked date
    //     const existingEvent = this.calendarOptions.events.find(
    //       (event) => event.start === info.dateStr
    //     );

    //     // If an event exists for the clicked date, display a message
    //     if (existingEvent) {
    //       console.log("existing event for this date", existingEvent);
    //       // alert(`A maintenance plan already exists for ${info.dateStr}.`);

    //       if (existingEvent.color === "orange") {
    //         this.modifyEvent(existingEvent);
    //       } else if (existingEvent.color === "green") {
    //         this.selectedEvent = existingEvent;
    //         console.log(
    //           "this is selected event passed as prop ",
    //           this.selectedEvent
    //         );

    //         this.togglePlanDetailsModal();
    //       }
    //     } else {
    //       // If there is no event for the clicked date, open a modal to create a new maintenance plan
    //       console.log("inside creating plan by manually marking dates");
    //       const maintenancePlanInfo = {
    //         selectedMachine: this.selectedMachine,
    //         selectedDate: info.dateStr,
    //       };
    //       this.maintenancePlanInfo = maintenancePlanInfo;

    //       this.toggleCreateMaintenancePlanModal();
    //     }
    //   } else {
    //     console.error("info or info.dateStr is undefined");
    //   }
    // },
    handleDateClick(info) {
      console.log("inside creating plan by manually marking dates");
      const maintenancePlanInfo = {
        selectedMachine: this.selectedMachine,
        selectedDate: info.dateStr,
      };
      this.maintenancePlanInfo = maintenancePlanInfo;
      this.toggleCreateMaintenancePlanModal();
    },

    modifyEvent(clickedEvent) {
      const { color, maintenance_activity_completed, note } =
        clickedEvent.extendedProps;

      if (color === "orange") {
        this.selectedEvent = clickedEvent;
        this.toggleEditableModal(clickedEvent);
      } else if (color === "red" && maintenance_activity_completed === "") {
        this.selectedEvent = clickedEvent;
        this.toggleEditableModal(clickedEvent);
      } else if (color === "red" && maintenance_activity_completed === false) {
        this.selectedEvent = clickedEvent;
        this.togglePlanDetailsModal();
      } else if (color === "green" && note !== null) {
        this.selectedEvent = clickedEvent;
        this.toggleEditableModal(clickedEvent);
      }
    },
    toggleEditableModal(clickedEvent) {
      const modalTitle =
        (clickedEvent.extendedProps.color === "orange" ||
          clickedEvent.extendedProps.color === "red") &&
        !clickedEvent.extendedProps.note
          ? "Mark Activity"
          : "Edit Activity";

      this.showEditableModal = !this.showEditableModal;
      this.modalTitle = modalTitle;
    },

    // confirmCreateMaintenancePlan(info) {
    //   const confirmed = confirm(
    //     `Create a maintenance plan for ${info.dateStr}?`
    //   );
    //   if (confirmed) {
    //     // Create maintenance plan
    //     const maintenancePlan = {
    //       maintenance_date: info.date,
    //       machine: this.selectMachine,

    //       // Add other properties as needed
    //     };
    //     this.createMaintenancePlan(maintenancePlan);
    //   }
    // },
    createMaintenancePlan(maintenancePlan) {
      // Handle the creation of maintenance plan
      // You can send a request to the server to create the maintenance plan
      console.log("Creating maintenance plan:", maintenancePlan);
    },

    closeCreateMaintenancePlanModal() {
      this.showCreateMaintenancePlanModal = false;
    },

    closePlanDetailsModal() {
      console.log("inside close modal parent");
      this.showPlanDetailsModal = false;

      // Set showModal to false to hide the modal
    },
    closeEditableNoteModal() {
      this.showEditableModal = false;
    },
    populateCalendarNew(data) {
      this.maintenance_plans = data;
      this.populateCalendar();
    },

    toggleCreateMaintenancePlanModal() {
      this.showCreateMaintenancePlanModal =
        !this.showCreateMaintenancePlanModal;
    },

    togglePlanDetailsModal() {
      this.showPlanDetailsModal = !this.showPlanDetailsModal;
    },

    selectLine() {
      // Filter machines based on the selected line
      console.log("inside select line");
      console.log("Selected Line ID:=", this.selectedLine);

      if (this.selectedLine) {
        this.filteredMachines = this.selectedLine.machines;
        console.log(this.filteredMachines);
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
        const selectedMachineId = this.selectedMachine.id;
        this.selectedMachineId = selectedMachineId;
        this.fetchMaintenanceDates(this.selectedMachine.id);
      }
    },
  },

  // mounted() {
  //   this.getData(); // Fetch data from the server
  //   // Receive the query parameters from the URL
  //   const { lineId, machineId } = this.$route.query;

  //   console.log("line id for marent", lineId);
  //   // Assign them to variables
  //   this.preselectedLineId = lineId;
  //   this.preselectedMachineId = machineId;

  //   // // Set the initial selected line and machine based on props

  // },
  // mounted() {
  //   // Fetch data from the server
  //   const { lineId, machineId } = this.$route.query;
  //   // Assign them to variables
  //   this.preselectedLineId = lineId;
  //   this.preselectedMachineId = machineId;
  //   console.log("this is the line id from yearly", lineId);
  //   console.log("this is the machiine id from yearly", machineId);

  //   this.getData();
  // },

  mounted() {
    // Fetch data from the server
    this.getData();
    // window.history.pushState({}, document.title, window.location.pathname);
    // console.log("this is the line id from yearly", lineId);
    // console.log("this is the machiine id from yearly", machineId);
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

/* CSS for legends */
.legends-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.red {
  background-color: red;
}
.yellow {
  background-color: orange;
}
.green {
  background-color: green;
}
</style>
