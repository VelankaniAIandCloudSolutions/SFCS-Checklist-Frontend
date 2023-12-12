<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Dashboard</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                Dashboard
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Buttons on the right -->
      <div class="col-md-6 mt-4 text-end">
        <div class="container has-text-centered">
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ selectedOption }}
            </button>
            <ul class="dropdown-menu">
              <li @click="selectOption('Today')">
                <a class="dropdown-item" href="#">Today</a>
              </li>
              <li @click="selectOption('Previous_Week')">
                <a class="dropdown-item" href="#">Previous Week</a>
              </li>
              <li @click="selectOption('Previous_Month')">
                <a class="dropdown-item" href="#">Previous Year</a>
              </li>
              <li>
                <div class="input-group date" data-provide="datepicker">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Select date range"
                  />
                  <div class="input-group-append">
                    <span class="input-group-text"
                      ><i class="far fa-calendar-alt"></i
                    ></span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="list-item">
      <ul class="list-group mt-4 shadow">
        <li class="list-group-item">
          <div class="row align-items-center">
            <div class="col-md-4">
              <div class="small-box bg-gradient-success">
                <div class="inner">
                  <h3>
                    {{
                      result.completed_checklists
                        ? result.completed_checklists.length
                        : "Loading"
                    }}
                  </h3>

                  <p>Completed</p>
                </div>
                <div class="icon">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="small-box bg-gradient-primary">
                <div class="inner">
                  <h3>
                    {{
                      result.in_progress ? result.in_progress.length : "Loading"
                    }}
                  </h3>
                  <p>In Progress</p>
                </div>
                <div class="icon">
                  <i class="fa-solid fa-spinner"></i>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="small-box bg-gradient-danger">
                <div class="inner">
                  <h3>
                    {{
                      result.failed_checklists
                        ? result.failed_checklists.length
                        : "Loading"
                    }}
                  </h3>
                  <p>Failed</p>
                </div>
                <div class="icon">
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="row mt-4 d-flex">
      <!-- Card 1 -->
      <div class="col-6">
        <div class="card card-primary">
          <div class="card-header">
            <h3 class="card-title">In Progress Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <span class="badge badge-primary">View All</span>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <ul class="">
                <li
                  v-for="(checklist, index) in result.in_progress"
                  :key="index"
                  class="d-flex justify-content-between align-items-center"
                >
                  {{ checklist.bom.product.name }} -
                  {{ checklist.updated_at }}
                  <!-- Right Column for Eye Icon Button -->
                  <i class="fas fa-eye"> </i>
                </li>
              </ul>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>
      <div class="col-6">
        <div class="card card-success">
          <div class="card-header">
            <h3 class="card-title">Completed Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <span class="badge badge-primary">View All</span>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <ul class="">
                <li
                  v-for="(checklist, index) in result.in_progress"
                  :key="index"
                  class="d-flex justify-content-between align-items-center"
                >
                  {{ checklist.bom.product.name }} -
                  {{ checklist.updated_at }}
                  <!-- Right Column for Eye Icon Button -->
                  <i class="fas fa-eye"> </i>
                </li>
              </ul>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>

      <!-- Card 2 (Completed) -->
      <!-- <div class="col-6">
        <div class="col-6">
          <div class="card" style="width: 30rem">
            <div class="card-header">
              <h4><strong>Completed Checklists:</strong></h4>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                  v-for="(checklist, index) in result.completed_checklists"
                  :key="index"
                  class="list-group-item"
                >
                  {{ checklist.bom.product.name }} - {{ checklist.updated_at }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="row mt-4 d-flex">
      <!-- Card 1 -->
      <div class="col-6">
        <div class="card card-primary">
          <div class="card-header">
            <h3 class="card-title">In Progress Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <span class="badge badge-primary">View All</span>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <ul class="">
                <li
                  v-for="(checklist, index) in result.in_progress"
                  :key="index"
                  class="d-flex justify-content-between align-items-center"
                >
                  {{ checklist.bom.product.name }} -
                  {{ checklist.updated_at }}
                  <!-- Right Column for Eye Icon Button -->
                  <i class="fas fa-eye"> </i>
                </li>
              </ul>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>
      <div class="col-6">
        <div class="card card-light">
          <div class="card-header">
            <h3 class="card-title">In Progress Checklists</h3>
            <div class="card-tools">
              <!-- Buttons, labels, and many other things can be placed here! -->
              <!-- Here is a label for example -->
              <span class="badge badge-primary">View All</span>
            </div>
            <!-- /.card-tools -->
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <ul class="">
                <li
                  v-for="(checklist, index) in result.in_progress"
                  :key="index"
                  class="d-flex justify-content-between align-items-center"
                >
                  {{ checklist.bom.product.name }} -
                  {{ checklist.updated_at }}
                  <!-- Right Column for Eye Icon Button -->
                  <i class="fas fa-eye"> </i>
                </li>
              </ul>
            </div>
          </div>
          <!-- /.card-body -->
          <!-- /.card-footer -->
        </div>
      </div>

      <!-- Card 2 (Completed) -->
      <!-- <div class="col-6">
        <div class="col-6">
          <div class="card" style="width: 30rem">
            <div class="card-header">
              <h4><strong>Completed Checklists:</strong></h4>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                  v-for="(checklist, index) in result.completed_checklists"
                  :key="index"
                  class="list-group-item"
                >
                  {{ checklist.bom.product.name }} - {{ checklist.updated_at }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <!-- Second Row -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selectedOption: "Today",
      result: {},
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
      this.fetchData();
    },
    async fetchData() {
      axios
        .post("store/get-checklist-count/", {
          selected_option: this.selectedOption,
        })
        .then((response) => {
          this.result = response.data;
          console.log("backend data", this.result);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
