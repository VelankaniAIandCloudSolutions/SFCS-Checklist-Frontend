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
        <!-- <select v-model="selectedLine" @change="selectLine"> -->
        <!-- <option disabled value="">Select Line</option>
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
        </select> -->
        <button
          type="submit"
          class="btn btn-primary btn-sm ms-2"
          @click="createPlan"
        >
          Create Plan
        </button>
      </div>
    </div>
    <!-- Rest of your component -->

    <div class="card card-outline card-primary mt-5">
      <div class="card-header">
        <h3 class="card-title" style="font-weight: bold; font-size: 1.2em">
          Plan Creation:
        </h3>
        <div class="card-tools"></div>
        <!-- /.card-tools -->
      </div>
      <!-- /.card-header -->
      <div class="card-body">
        <div class="mt-4">
          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="yearSelect" class="form-label">
                      <i class="fas fa-calendar-alt"></i> Select Year
                    </label>
                    <select
                      class="form-select"
                      v-model="selectedYear"
                      id="yearSelect"
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                      <option value="2030">2030</option>
                      <option value="2031">2031</option>
                      <option value="2032">2032</option>
                      <option value="2033">2033</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="monthSelect" class="form-label">
                      <i class="fas fa-calendar-alt"></i> Select Month
                    </label>
                    <select
                      class="form-select"
                      v-model="selectedMonth"
                      id="monthSelect"
                    >
                      <option value="" disabled>Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="lineSelect" class="form-label">
                      <i class="fas fa-chart-line"></i> Select Line
                    </label>
                    <select
                      class="form-select"
                      v-model="selectedLine"
                      @change="selectLineNew"
                    >
                      <option value="" disabled>Select Line</option>
                      <option
                        v-for="line in lines"
                        :key="line.id"
                        :value="line.id"
                      >
                        {{ line.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="customFilterSelect" class="form-label">
                      <i class="fas fa-filter"></i> Custom Date
                    </label>
                    <select
                      class="form-select"
                      v-model="selectedCustomFilter"
                      id="customFilterSelect"
                    >
                      <option value="" disabled>Select Custom Filter</option>
                      <option value="wholeMonth">Whole Month</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-12">
                <label for="activityTypeSelect" class="form-label">
                  <i class="fas fa-tasks"></i> Select Activity Type
                </label>

                <select
                  id="activityTypeSelect"
                  class="form-select"
                  v-model="selectedType"
                >
                  <option value="" disabled>Select Type</option>
                  <option
                    v-for="type in maintenance_activity_types"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- /.card-body -->
      </div>
      <!-- /.card -->

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
      :selectedLineId="selectedLine"
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
      @maintenance-activity-note-updated="populateCalendarNew"
      @maintenance-activity-deleted="populateCalendarNew"
    />

    <DeleteMaintenancePlanModalLineWise
      :show="showDeletePlanModal"
      :selectedEvent="selectedEvent"
      :clickedEvent="clickedEvent"
      @close-modal="closeDeletePlanModal"
      :selectedLineId="selectedLine"
      :selectedTypeId="selectedType"
      @event-color-updated="handleEventColorUpdated"
      @maintenance-plans-deleted-line-wise="populateCalendarNew"
    />

    <MarkStatusModal
      :show="showMarkStatusModal"
      :selectedEvent="selectedEvent"
      :clickedEvent="clickedEvent"
      @close-modal="closeMarkStatusModal"
      :modalTitle="modalTitle"
      :selectedLineId="selectedLine"
      :selectedTypeId="selectedType"
      @event-color-updated="handleEventColorUpdated"
      @maintenance-plan-deleted="populateCalendarNew"
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
// import multiMonthPlugin from "@fullcalendar/multimonth";
// import { Calendar } from "@fullcalendar/core";
import axios from "axios";
import MaintenancePlanDetailsModal from "../../components/machine_maintenance/MaintenancePlanDetailsModal.vue";
import CreateMaintenancePlanModal from "../../components/machine_maintenance/CreateMaintenancePlanModal.vue";
import EditableNoteModal from "../../components/machine_maintenance/EditableNoteModal.vue";
import MarkStatusModal from "../../components/machine_maintenance/MarkStatusModal.vue";
import DeleteMaintenancePlanModalLineWise from "../../components/machine_maintenance/DeleteMaintenancePlanModalLineWise.vue";
// import { is } from "core-js/core/object";

export default {
  props: ["lineId", "machineId"],

  components: {
    FullCalendar,
    MaintenancePlanDetailsModal,
    CreateMaintenancePlanModal,
    EditableNoteModal,
    MarkStatusModal,
    DeleteMaintenancePlanModalLineWise,
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
        dateClick: this.handleDateClick,
        // dateClick: this.handleDateClick,
        // selectable: true,

        // select: this.handleDateSelect,
      },

      selectedMonth: "",
      selectedYear: "",
      selectedCustomFilter: "",

      lines: [],

      selectedLine: "",
      selectedMachine: "",
      selectedEvent: {},
      showPlanDetailsModal: false,
      showCreateMaintenancePlanModal: false,
      maintenance_plans: {},
      all_maintenance_plans: {},
      maintenance_activity_types: [],
      maintenancePlanInfo: {},
      showEditableModal: false,
      showMarkStatusModal: false,
      showDeletePlanModal: false,
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

    createPlan() {
      this.$store.commit("setIsLoading", true);
      console.log("this is the selected mahcine", this.selectedMachinesArray);

      const formData = {
        selectedYear: this.selectedYear,
        selectedType: this.selectedType,
        selectedMonth: this.selectedMonth,
        selectedCustomFilter: this.selectedCustomFilter,
        selectedLine: this.selectedLine,
      };
      console.log("data being passed from front-end", formData);

      axios
        .post(
          "/machine-maintenance/create-maintenance-plan-for-all-machines-of-a-line/",
          formData
        )
        .then((response) => {
          // Print the response message
          console.log(response.data.message);
          this.$notify({
            title: "Maintenance Plan Created",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });
          this.$router.push("/machine/calendar-yearly-view");
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error:", error);
          this.$notify({
            title: "Error creating  Maintenance plan",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        });
    },
    // fetchMaintenanceDates(machineId) {
    //   console.log("id of the machine selected", machineId);
    //   axios
    //     .post("machine-maintenance/get-maintenance-plan/", {
    //       machine_id: machineId,
    //     })
    //     .then((response) => {
    //       // console.log("this is response data", response.data);

    //       this.maintenance_plans = response.data.maintenance_plans;
    //       console.log("this is maintenance_plans ", this.maintenance_plans);
    //       this.populateCalendar();
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching maintenance dates:", error);
    //     });
    // },
    fetchMaintenanceDatesNew(lineId) {
      console.log("id of the line selected", lineId);
      axios
        .post("machine-maintenance/get-maintenance-plan-new-line-wise/", {
          line_id: lineId,
        })
        .then((response) => {
          // console.log("this is response data", response.data);

          this.maintenance_plans = response.data.maintenance_plans;
          this.all_maintenance_plans = response.data.all_maintenance_plans;
          console.log("this is maintenance_plans ", this.maintenance_plans);
          this.populateCalendar();
        })
        .catch((error) => {
          console.error("Error fetching maintenance dates:", error);
        });
    },

    // Populate the calendar with events based on maintenance plans
    populateCalendar() {
      console.log("Inside populate calendar");
      const today = new Date();
      console.log(today);

      // Helper function to check if there are any plans with maintenance activities for a given maintenance date
      function hasMaintenanceActivities(plans, maintenanceDate) {
        // Filter plans for the given maintenance date
        const plansForDate = plans.filter((plan) => {
          const planMaintenanceDate = new Date(plan.maintenance_date);
          return (
            planMaintenanceDate.setHours(0, 0, 0, 0) ===
            maintenanceDate.setHours(0, 0, 0, 0)
          );
        });

        // Check if all plans for the date have maintenance activities
        return plansForDate.every(
          (plan) =>
            plan.maintenance_activities &&
            plan.maintenance_activities.length > 0
        );
      }

      // Helper function to check if all maintenance activities associated with plans for a given maintenance date are completed
      function areAllMaintenanceActivitiesCompleted(plans, maintenanceDate) {
        // Filter plans for the given maintenance date
        const plansForDate = plans.filter((plan) => {
          const planMaintenanceDate = new Date(plan.maintenance_date);
          return (
            planMaintenanceDate.setHours(0, 0, 0, 0) ===
            maintenanceDate.setHours(0, 0, 0, 0)
          );
        });

        // Check if there are any plans for the date with maintenance activities
        if (plansForDate.length > 0) {
          // Check if all activities for all plans are completed
          return plansForDate.every(
            (plan) =>
              plan.maintenance_activities &&
              plan.maintenance_activities.length > 0 &&
              plan.maintenance_activities.every(
                (activity) => activity.is_completed
              )
          );
        }
        return false; // Return false if there are no plans for the date with maintenance activities
      }

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
          hasMaintenanceActivities(this.all_maintenance_plans, maintenanceDate)
        ) {
          is_completed = areAllMaintenanceActivitiesCompleted(
            this.all_maintenance_plans,
            maintenanceDate
          );

          if (maintenanceDate < today) {
            color = is_completed ? "green" : "red";
          } else if (maintenanceDate.getTime() === today.getTime()) {
            color = is_completed ? "green" : "red";
          } else {
            color = "orange";
          }
        } else {
          if (maintenanceDate < today) {
            color = "red";
          } else {
            color = "orange";
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
    // handleEventClick(info) {
    //   console.log("event clicked");
    //   console.log("info:", info);
    //   console.log("info.event:", info.event);

    //   console.log(info.event.id);

    //   const clickedEventStartDate = info.event.start;

    //   console.log("clicked event start date", clickedEventStartDate);

    //   // Convert clicked event start date to a date string without time component
    //   // const formattedClickedEventStartDate = clickedEventStartDate
    //   //   .toISOString()
    //   //   .split("T")[0];
    //   const formattedClickedEventStartDate =
    //     clickedEventStartDate.toLocaleString("en-IN", {
    //       timeZone: "Asia/Kolkata",
    //     });
    //   const dateOnly = formattedClickedEventStartDate.split(",")[0]; // Extracting the date part

    //   const [day, month, year] = dateOnly
    //     .split("/")
    //     .map((part) => part.padStart(2, "0")); // Splitting the date parts and adding leading zeros if necessary
    //   const formattedDate = `${year}-${month}-${day}`; // Rearranging and joining parts
    //   console.log(formattedDate);

    //   const eventsOnSameDate = this.calendarOptions.events.filter((event) => {
    //     // Extract the date part without time component from the event's start date
    //     const eventStartDate = event.start;

    //     // Compare the dates without time component
    //     return eventStartDate === formattedDate;
    //   });

    //   console.log("events on same date", eventsOnSameDate);

    //   const existingEvent = eventsOnSameDate.find(
    //     (event) => event.extendedProps.id === info.event.extendedProps.id
    //   );

    //   console.log("existingEvent", existingEvent);
    //   if (existingEvent) {
    //     console.log("existing event for this date", existingEvent);
    //     // alert(`A maintenance plan already exists for ${info.dateStr}.`);

    //     if (
    //       existingEvent.extendedProps.color === "orange" ||
    //       existingEvent.extendedProps.color === "red"
    //     ) {
    //       this.modifyEvent(existingEvent);
    //     } else if (existingEvent.color === "green") {
    //       this.selectedEvent = existingEvent;
    //       console.log(
    //         "this is selected event passed as prop ",
    //         this.selectedEvent
    //       );

    //       this.togglePlanDetailsModal();
    //     }
    //   } else {
    //     // If there is no event for the clicked date, open a modal to create a new maintenance plan
    //     const maintenancePlanInfo = {
    //       selectedMachine: this.selectedMachine,
    //       selectedDate: info.dateStr,
    //     };
    //     this.maintenancePlanInfo = maintenancePlanInfo;

    //     this.toggleCreateMaintenancePlanModal();
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
      if (existingEvent) {
        this.selectedEvent = existingEvent;
        this.toggleDeletePlanModal();
      } else {
        // If there is no event for the clicked date, open a modal to create a new maintenance plan
        const maintenancePlanInfo = {
          selectedMachine: this.selectedMachine,
          selectedDate: info.dateStr,
        };
        this.maintenancePlanInfo = maintenancePlanInfo;

        this.toggleCreateMaintenancePlanModal();
      }
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
      // Check if the event is already green and a note exists

      //   if(clickedEvent.color==="green")
      if (
        clickedEvent.extendedProps.color === "orange" ||
        clickedEvent.extendedProps.color === "red"
      ) {
        // First time modification, no note exists
        this.selectedEvent = clickedEvent;
        // Set modal title
        this.toggleEditableModal(clickedEvent);
      } else if (
        clickedEvent.extendedProps.color === "green" &&
        clickedEvent.extendedProps.note !== null
      ) {
        this.selectedEvent = clickedEvent;

        this.toggleEditableModal(clickedEvent);
      }
    },
    toggleEditableModal(clickedEvent) {
      const modalTitle =
        (clickedEvent.extendedProps.color === "orange" ||
          clickedEvent.extendedProps.color === "red") &&
        !clickedEvent.extendedProps.note
          ? "Mark Activity "
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
      this.showPlanDetailsModal = false;
    },

    closeDeletePlanModal() {
      this.showDeletePlanModal = false;

      // Set showModal to false to hide the modal
    },
    closeEditableNoteModal() {
      this.showEditableModal = false;
    },
    closeMarkStatusModal() {
      this.showMarkStatusModal = false;
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

    toggleDeletePlanModal() {
      this.showDeletePlanModal = !this.showDeletePlanModal;
    },

    toggleMarkStatusModal() {
      this.showMarkStatusModal = !this.showMarkStatusModal;
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

    selectLineNew() {
      console.log("inside select line");
      console.log("Selected Line ID:=", this.selectedLine);

      if (this.selectedLine) {
        this.fetchMaintenanceDatesNew(this.selectedLine);
      }
    },

    selectMachine() {
      console.log("inside select machine");
      console.log("Selected machine:", this.selectedMachine);
      if (this.selectedMachine) {
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
.form-label {
  font-weight: bold;
}

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
