<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="bom"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      :frameworkComponents="{ editButtonRenderer: editButtonRenderer }"
    >
    </ag-grid-vue>
    <!-- Modal -->
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "BomItemDetails",
  components: {
    AgGridVue,
  },
  props: {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    bom: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // rowData: this.bom || [],
      colDefs: [
        //   {

        { headerName: "ID", field: "id", hide: true },
        { headerName: " Level", field: "level" },
        { headerName: "VEPL Part Number", field: "part_number" },
        { headerName: "Priority Level", field: "priority_level" },

        { headerName: "Value", field: "value" },
        { headerName: "PCB Footprint", field: "pcb_footprint" },
        { headerName: "Type", field: "line_item_type.name" },

        { headerName: "Description", field: "description" },
        {
          headerName: "References",
          valueGetter: function (params) {
            const references = params.data.references;

            if (references && references.length > 0) {
              // Use map to get an array of reference names
              const referenceNames = references.map(
                (reference) => reference.name
              );

              // Join the array of reference names into a single string separated by commas
              return referenceNames.join(", ");
            }

            return ""; // Return an empty string if no references are available
          },
        },
        {
          headerName: "Manufacturer Parts",
          valueGetter: function (params) {
            const manufacturerParts = params.data.manufacturer_parts;

            if (manufacturerParts && manufacturerParts.length > 0) {
              // Use map to create an array of strings for each manufacturer part
              const partStrings = manufacturerParts.map((manufacturerPart) => {
                const manufacturer = manufacturerPart.manufacturer;
                if (manufacturer) {
                  // Concatenate name and part_number with a hyphen in between
                  return `${manufacturerPart.part_number} - ${manufacturer.name}`;
                }
                return ""; // Return an empty string if data is missing
              });

              // Join the array of strings into a single string separated by commas
              return partStrings.join(", ");
            }

            return ""; // Return an empty string if no manufacturer parts are available
          },
        },
        { headerName: "Customer Part Number", field: "customer_part_number" },
        { headerName: "Quantity", field: "quantity" },
        { headerName: "UOM", field: "uom" },
        { headerName: "Assembly Stage", field: "assembly_stage.name" },

        { headerName: "ECN", field: "ecn" },
        { headerName: "MSL", field: "msl" },
        { headerName: "Remarks", field: "remarks" },
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
  mounted() {
    // Uncomment and modify the fetchData method based on your API endpoint
    // this.fetchData();
  },
  methods: {
    // Uncomment and modify the fetchData method based on your API endpoint
    // async fetchData() {
    //   const response = await fetch("Your API Endpoint");
    //   this.rowData = await response.json();
    // },

    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    onRowSelected(params) {
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
    },
    editButtonRenderer(params) {
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-edit"></i>`;
      button.classList.add("btn", "btn-primary");

      button.addEventListener("click", () => this.onEditClick(params.data.id));
      return button;
    },
    onEditClick(id) {
      this.$router.push({ name: "BomLineItemEdit", params: { id } });
    },
  },
};
</script>

<style scoped></style>
