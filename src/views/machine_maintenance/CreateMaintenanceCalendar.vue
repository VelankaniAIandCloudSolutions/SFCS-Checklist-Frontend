<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Create Maintenance Calendar</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/">
                  <i class="fas fa-home me-1"></i>Home
                </router-link>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 mt-4 text-end">
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          @click="createPlan"
        >
          Create Plan
        </button>
      </div>
    </div>

    <div class="container mt-5">
      <section class="mb-3">
        <label for="year" class="form-label">Select Year:</label>
        <select id="year" class="form-select" v-model="selectedYears" multiple>
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
      </section>

      <section class="mb-3">
        <label for="dates" class="form-label">Select Dates:</label>
        <select
          id="dates"
          class="form-select"
          v-model="selectedDates"
          @change="openModal"
        >
          <option
            value="customizable"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Customizable Date
          </option>
          <option value="wholeMonth">Whole Month</option>
        </select>
      </section>
      <section>
        <div class="accordion" id="accordion">
          <div
            v-for="(choice, index) in DateChoices.choices"
            :key="index"
            class="accordion-item"
          >
            <h2 class="accordion-header" :id="'headingChoice' + index">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapseChoice' + index"
                aria-expanded="true"
                :aria-controls="'collapseChoice' + index"
              >
                Choice {{ index + 1 }}
              </button>
            </h2>
            <div
              :id="'collapseChoice' + index"
              class="accordion-collapse collapse"
              :aria-labelledby="'headingChoice' + index"
              data-bs-parent="#accordion"
            >
              <div class="accordion-body">
                <ul>
                  <li>
                    <strong>Selected Months:</strong>
                    {{ choice.selectedMonths.join(", ") }}
                  </li>
                  <li>
                    <strong>Selected Weeks:</strong>
                    {{ choice.selectedWeeks.join(", ") }}
                  </li>
                  <li>
                    <strong>Selected Days:</strong>
                    {{ choice.selectedDays.join(", ") }}
                  </li>
                  <!-- <li>
                    <strong>Selected Weeks Except:</strong>
                    {{ choice.selectedWeeksExcept.join(", ") }}
                  </li>
                  <li>
                    <strong>Selected Days Except:</strong>
                    {{ choice.selectedDaysExcept.join(", ") }}
                  </li> -->
                </ul>
                <div class="mt-3">
                  <button
                    @click="editFormChoice(index)"
                    class="btn btn-primary me-2"
                  >
                    <i class="fas fa-edit"></i> Edit
                  </button>
                  <button
                    @click="removeFormChoice(index)"
                    class="btn btn-danger"
                  >
                    <i class="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="mb-3">
        <label for="machine" class="form-label">Machine:</label>
        <!-- <select id="machine" class="form-select" v-model="selectedMachine">
          <option disabled value="">Please select</option>
          <option
            v-for="machine in machines"
            :key="machine.id"
            :value="machine.id"
          >
            {{ machine.name }}
          </option>
        </select> -->

        <!-- Button trigger modal -->
        <br />
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#machineModal"
        >
          Select Machines
        </button>
        <br />
        <div class="tag-container">
          <div
            v-for="(tag, index) in selectedMachinesArray"
            :key="index"
            class="tag badge bg-secondary"
          >
            <span>{{ tag.name }}</span>
            <!-- <span
              @click="removeTag(index)"
              class="remove-icon"
              style="color: #ff0000"
              >&times;</span
            > -->
          </div>
        </div>

        <!-- Modal -->
        <div
          class="modal fade"
          id="machineModal"
          tabindex="-1"
          aria-labelledby="machineModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="machineModalLabel">
                  Select Machines
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <MachineTableGrid
                  style="margin-top: 20px"
                  :machines="machines"
                  :selectedMachinesArray="selectedMachinesArray"
                  @rowClicked="handleRowClicked"
                  @rowsDeselected="handleRowDeselected"
                  @rowsSelected="handleRowsSelected"
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Section for selecting Type -->
      <section class="mb-3">
        <label for="type" class="form-label">Type:</label>
        <select id="type" class="form-select" v-model="selectedType">
          <option disabled value="">Please select</option>
          <option
            v-for="type in maintenance_activity_types"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </option>
        </select>
      </section>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              {{ editingIndex !== null ? "Update Choice" : "Custom Dates" }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- First Row: For Months -->
            <div class="row mb-3">
              <div class="col">
                <label for="monthDropdown" class="form-label"
                  >For Months:</label
                >
                <select
                  id="monthDropdown"
                  class="form-select"
                  multiple
                  v-model="formChoice.selectedMonths"
                >
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
              <div class="col">
                <label class="form-label">Selected Month:</label>
                <p>{{ formChoice.selectedMonths }}</p>
              </div>
            </div>

            <!-- Second Row: For Weeks -->
            <div class="row mb-3">
              <div class="col">
                <label for="weekDropdown" class="form-label">For Weeks:</label>
                <select
                  id="weekDropdown"
                  class="form-select"
                  multiple
                  v-model="formChoice.selectedWeeks"
                >
                  <option value="Week 1">Week 1</option>
                  <option value="Week 2">Week 2</option>
                  <option value="Week 3">Week 3</option>
                  <option value="Week 4">Week 4</option>
                  <option value="Week 5">Week 5</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Weeks:</label>
                <p>{{ formChoice.selectedWeeks }}</p>
              </div>
            </div>

            <!-- Third Row: On Days -->
            <div class="row mb-3">
              <div class="col">
                <label for="dayDropdown" class="form-label">On Days:</label>
                <select
                  id="dayDropdown"
                  class="form-select"
                  multiple
                  v-model="formChoice.selectedDays"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Days:</label>
                <p>{{ formChoice.selectedDays }}</p>
              </div>
            </div>

            <!-- Additional Form Elements (if any) -->

            <!-- Except -->
            <!-- <div class="mt-4">
              <label for="exceptInput" class="form-label fw-bold fs-5"
                >Except:</label
              >
            </div> -->

            <!-- For Week on Day -->
            <!-- <div class="row mb-3">
              <div class="col">
                <label for="weekOnDayDropdown" class="form-label"
                  >For Week:</label
                >
                <select
                  id="weekOnDayDropdown"
                  class="form-select"
                  multiple
                  v-model="formChoice.selectedWeeksExcept"
                >
                  <option value="Week 1">Week 1</option>
                  <option value="Week 2">Week 2</option>
                  <option value="Week 3">Week 3</option>
                  <option value="Week 4">Week 4</option>
                  <option value="Week 5">Week 5</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Week:</label>
                <p>{{ formChoice.selectedWeeksExcept }}</p>
              </div>
            </div> -->
            <!-- <div class="row mb-3">
              <div class="col">
                <label for="dayOnDayDropdown" class="form-label">On Day:</label>
                <select
                  id="dayOnDayDropdown"
                  class="form-select"
                  multiple
                  v-model="formChoice.selectedDaysExcept"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div class="col">
                <label class="form-label">Selected Day:</label>
                <p>{{ formChoice.selectedDaysExcept }}</p>
              </div>
            </div> -->
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="
                editingIndex !== null ? updateFormChoice() : addFormChoice()
              "
            >
              {{ editingIndex !== null ? "Update Choice" : "Add Choice" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal end -->
  </div>
</template>

<script>
// Call the function to generate year options for the next 10 years

import axios from "axios";

import MachineTableGrid from "../../components/machine_maintenance/MachineTableGrid.vue";
export default {
  components: {
    MachineTableGrid,
  },
  data() {
    return {
      selectedDates: null,

      type: "",
      formChoice: {
        selectedMonths: [],
        selectedWeeks: [],
        selectedDays: [],
        selectedWeeksExcept: [],
        selectedDaysExcept: [],
      },

      editedChoice: {
        // Define editedChoice object
        selectedMonths: [],
        selectedWeeks: [],
        selectedDays: [],
        selectedWeeksExcept: [],
        selectedDaysExcept: [],
      },
      DateChoices: {
        choices: [],
      },
      editingIndex: null,
      machines: [],
      types: [],
      selectedMachine: null,
      selectedType: null,
      selectedYears: [],
      maintenance_activity_types: [],
      selectedMachinesArray: [],
    };
  },

  mounted() {
    this.getData();
  },
  computed: {
    filteredTypes() {
      if (!this.selectedMachine || this.types.length === 0) {
        return [];
      }
      return this.types.filter((type) => type.id === this.selectedMachine);
    },
  },
  methods: {
    handleRowsSelected(selectedRows) {
      // Handle rows selected event
      this.selectedMachinesArray = selectedRows;
      console.log("selected machines array", this.selectedMachinesArray);
    },
    removeTag(index) {
      // Remove tag at the given index
      this.selectedMachinesArray.splice(index, 1);
      console.log("selected machiens array", this.selectedMachinesArray);
    },
    openModal() {
      if (this.selectedDates === "customizable") {
        const modalTriggerButton = document.querySelector(
          '[data-bs-target="#exampleModal"]'
        );
        if (modalTriggerButton) {
          modalTriggerButton.click();
        }
      }
    },
    editFormChoice(index) {
      this.editingIndex = index;
      // Set formChoice to the choice being edited
      this.formChoice = { ...this.DateChoices.choices[index] };
      this.openModalGeneral(); // Open the modal
    },
    addFormChoice() {
      console.log("Form Choice:", this.formChoice);
      this.DateChoices.choices.push({ ...this.formChoice });

      this.formChoice = {
        selectedMonths: [],
        selectedWeeks: [],
        selectedDays: [],
        // selectedWeeksExcept: [],
        // selectedDaysExcept: [],
      };
      console.log(" whole list of form choice array", this.DateChoices);
    },

    openModalGeneral() {
      const modalTriggerButton = document.querySelector(
        '[data-bs-target="#exampleModal"]'
      );
      if (modalTriggerButton) {
        modalTriggerButton.click();
      }
    },
    closeModalGeneral() {
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
    },
    updateFormChoice() {
      this.DateChoices.choices.splice(this.editingIndex, 1, {
        ...this.formChoice,
      });
      this.formChoice = {
        selectedMonths: [],
        selectedWeeks: [],
        selectedDays: [],
        // selectedWeeksExcept: [],
        // selectedDaysExcept: [],
      };
      this.editingIndex = null;
      this.closeModalGeneral();
    },

    removeFormChoice(index) {
      this.DateChoices.choices.splice(index, 1);
    },

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

    createPlan() {
      console.log("this is the selected mahcine", this.selectedMachinesArray);
      const formData = {
        selectedYears: this.selectedYears,
        selectedType: this.selectedType,
        dateChoices: this.DateChoices,
      };

      console.log("data being passed from front-end", formData);

      // axios
      //   .post("/machine-maintenance/create-maintenance-plan/", formData)
      //   .then((response) => {
      //     // Print the response message
      //     console.log(response.data.message);
      //   })
      //   .catch((error) => {
      //     // Handle errors here
      //     console.error("Error:", error);
      //   })
      //   .finally(() => {
      //     // This block will always execute, regardless of success or failure
      //     // You can perform cleanup or UI updates here
      //     console.log("Request completed.");
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-container {
  display: flex;
  flex-wrap: wrap; /* Ensure tags wrap to a new line if they exceed container width */
  justify-content: center; /* Center tags horizontally */
  margin-top: 10px;
}

.tag {
  margin: 5px;
  padding: 0.25rem 0.5rem; /* Reduce padding to make tags smaller */
  font-size: 0.875rem; /* Reduce font size to make tags smaller */
}

.remove-icon {
  cursor: pointer;
  margin-left: 5px;
}
</style>
