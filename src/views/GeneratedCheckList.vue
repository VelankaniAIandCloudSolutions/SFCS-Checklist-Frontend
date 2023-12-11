<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Generated Checklists</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active">
                <router-link to="/checklist">Checklist</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Generated Checklists
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Buttons on the right -->
      <div class="col-md-6 mt-4 text-end">
        <div class="container has-text-centered">
          <div class="d-flex">
            <button
              @click="generateChecklist"
              :disabled="!isButtonEnabled"
              class="btn btn-primary btn-sm"
            >
              Generate New Checklist
            </button>
            <button
              @click="checkExistingChecklist"
              class="btn btn-warning btn-sm ms-2"
            >
              View Ongoing Checklists
            </button>
            <button
              @click="viewGeneratedChecklists"
              class="btn btn-success btn-sm ms-2"
            >
              View Generated Checklists
            </button>
          </div>
        </div>
      </div>
    </div>
    <CheckListsTable style="margin-top: 20px" />
  </div>
</template>

<script>
import CheckListsTable from "../components/CheckListsTable.vue";
export default {
  components: { CheckListsTable },
};
</script>

<style></style>
