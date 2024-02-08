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
                <router-link to="/"
                  ><i class="fas fa-home me-1"></i>Home</router-link
                >
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
        <label for="dates" class="form-label">Select Dates:</label>
        <input
          type="date"
          id="dates"
          class="form-control"
          v-model="selectedDates"
          multiple
        />
      </section>
      <section class="mb-3">
        <label for="machine" class="form-label">Machine:</label>
        <select id="machine" class="form-select" v-model="selectedMachine">
          <option disabled value="">Please select</option>
          <option
            v-for="machine in machines"
            :key="machine.id"
            :value="machine.id"
          >
            {{ machine.name }}
          </option>
        </select>
      </section>
      <section class="mb-3">
        <label for="type" class="form-label">Type:</label>
        <input type="text" id="type" class="form-control" v-model="type" />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDates: [],
      selectedMachine: null,
      type: "",
    };
  },
  methods: {
    createPlan() {
      console.log("Selected Dates:", this.selectedDates);
      console.log("Selected Machine:", this.selectedMachine);
      console.log("Type:", this.type);
    },
  },
};
</script>

<style lang="scss" scoped></style>
