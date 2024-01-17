<template>
  <div>
    <ag-grid-vue
      v-if="boms.length > 0"
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="boms"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      @rowSelected="onRowSelected"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "BombDetailsTable", // Replace with your component name
  components: {
    AgGridVue,
  },
  props: {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    boms: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Initialize rowData as an empty array
      colDefs: [
        {
          field: "id", // Added "id" field
          hide: true,
        },
        {
          field: "product.project.name",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "Project Name",
        },

        {
          field: "product.name",

          headerName: "Product Name",
        },
        { field: "product.product_code", headerName: "Product Code" },
        { field: "bom_type.name", headerName: "BOM Type" },
        { field: "bom_rev_number", headerName: "BOM Rev No" },
        { field: "issue_date", headerName: "Issue Date" },
        { field: "product.product_rev_number", headerName: "Product Rev No" },
        {
          headerName: "Actions",
          cellRenderer: this.editButtonRenderer,
        },
      ],
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
      },
      selectedRows: [],
    };
  },
  methods: {
    onRowClicked(params) {
      // Emit an event with the clicked row data
      this.$emit("rowClicked", params.data);
      this.$router.push(`/bom/edit/${params.data.id}`);
    },
    onRowSelected(params) {
      // Emit an event with the selected row data
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
    },
    onSelectionChanged() {
      if (this.$refs.agGrid && this.$refs.agGrid.api) {
        this.selectedRows = this.$refs.agGrid.api.getSelectedRows();
      }
    },
    editButtonRenderer(params) {
      console.log(params);
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-edit"></i>`;
      button.classList.add("btn", "btn-primary");

      // Disable the button if no rows are selected or if more than one row is selected
      button.addEventListener("click", () => this.onEditClick(params.data.id));
      return button;
    },
    onEditClick(id) {
      this.$router.push(`/bom/edit/${id}`);
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
