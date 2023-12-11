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
