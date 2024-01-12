<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="projectList"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      @selectionChanged="onSelectionChanged"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  props: {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    projectList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Add more rows as needed

      colDefs: [
        {
          field: "id", // Added "id" field
          hide: true,
        },
        {
          field: "name",

          headerName: "Project Name",
        },
        { field: "project_code", headerName: "Project Code" },
        { field: "project_rev_number", headerName: "Project Rev No" },
        {
          headerName: "Actions",
          cellRenderer: this.editButtonRenderer,
        },
      ],

      defaultColDef: {
        filter: true, // Enable filtering by default for all columns
        sortable: true,
        resizable: true,
        autoSize: true,
      },
      selectedRows: [],
    };
  },

  methods: {
    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
      this.$router.push(`/project-edit/${params.data.id}`);
    },
    onRowSelected(params) {
      // Emit an event with the selected row data
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
    },
    onSelectionChanged(params) {
      const selectedData = params.api.getSelectedRows();
      const selectedRow = selectedData.length > 0 ? selectedData[0] : null;
      if (selectedRow) {
        this.$emit("rowSelected", selectedRow);
      } else {
        this.$emit("rowDeselected");
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
      this.$router.push(`/project-edit/${id}`);
    },
  },
};
</script>
<style scoped></style>
