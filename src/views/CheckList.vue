<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Breadcrumbs on the left -->
      <div class="col-md-6">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item"><a href="#">Category</a></li>
            <li class="breadcrumb-item active" aria-current="page">
              Current Page
            </li>
          </ol>
        </nav>
      </div>

      <!-- Buttons on the right -->
      <!-- <div class="col-md-6 text-end">
        <router-link to="/create-bom">
          <button class="btn btn-primary me-2">Create BOM</button>
        </router-link>
        <router-link to="/bom/upload">
          <button class="btn btn-secondary">Upload BOM</button>
        </router-link>
      </div> -->
    </div>
    <BomDetailsTable
      @rowClicked="handleRowClicked"
      @rowSelected="handleRowSelected"
    />
    <div style="margin-bottom: 20px"></div>
    <div class="container has-text-centered">
      <router-link to="/begin-checklist">
        <button class="btn btn-primary">Generate Checklist</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import BomDetailsTable from "../components/BomDetailsTable.vue";

export default {
  components: {
    BomDetailsTable,
  },
  data() {
    return {
      rowData: [],
      selectedRow: null,
    };
  },
  methods: {
    handleRowClicked(clickedRow) {
      // Handle the clicked row data in the parent component
      console.log("Clicked Row:", clickedRow);
      // Now you have access to the specific row data, and you can use it as needed.
    },
    handleRowSelected(rowData) {
      console.log("Row Selected:", rowData);
      this.selectedRow = rowData;
    },
  },
};
</script>

<style lang="scss" scoped></style>
