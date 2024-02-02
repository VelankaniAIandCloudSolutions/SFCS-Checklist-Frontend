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

    <!-- Bootstrap 5 Modal for BOM Revision Note -->
    <div
      class="modal fade"
      id="bomRevisionNoteModal"
      tabindex="-1"
      aria-labelledby="bomRevisionNoteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bomRevisionNoteModalLabel">
              BOM Revision Note
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ selectedBomRevisionNote }}</p>
          </div>
        </div>
      </div>
    </div>
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

        { field: "issue_date", headerName: "Issue Date" },
        { field: "product.product_rev_number", headerName: "Product Rev No" },
        { field: "bom_rev_number", headerName: "BOM Rev No" },

        {
          headerName: "BOM Revision Note",
          cellRenderer: this.bomRevisionNoteRenderer,
        },
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
      selectedBomRevisionNote: "",
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
    // bomRevisionNoteRenderer(params) {
    //   const button = document.createElement("button");

    //   if (params.data.change_note) {
    //     // If change_note is present, render the button
    //     button.innerHTML = `<i class="fas fa-eye"></i>`;
    //     button.classList.add("btn", "btn-secondary");
    //     button.dataset.bsToggle = "modal";
    //     button.dataset.bsTarget = "#bomRevisionNoteModal";
    //     button.addEventListener(
    //       "click",
    //       (event) => event.stopPropagation(),
    //       this.loadBomRevisionChangeNoteInModal(params.data)
    //     );
    //   } else {
    //     // If change_note is absent, render a text
    //     button.innerText = "Change note is absent";
    //     button.classList.add("btn", "btn-secondary", "disabled");
    //     button.disabled = true;
    //   }

    //   return button;
    // },

    bomRevisionNoteRenderer(params) {
      const contentWrapper = document.createElement("div");

      if (params.data.change_note) {
        // If change_note is present, render the button
        const button = document.createElement("button");
        button.innerHTML = `<i class="fas fa-eye"></i>`;
        button.classList.add("btn", "btn-secondary");
        button.dataset.bsToggle = "modal";
        button.dataset.bsTarget = "#bomRevisionNoteModal";
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          this.loadBomRevisionChangeNoteInModal(params.data);
        });
        contentWrapper.appendChild(button);
      } else {
        // If change_note is absent, render plain text
        const text = document.createElement("span");
        text.innerText = "No Change";
        text.classList.add("text-muted");
        contentWrapper.appendChild(text);
      }

      return contentWrapper;
    },

    loadBomRevisionChangeNoteInModal(rowData) {
      // Set the BOM Revision Note for the selected row
      console.log("to set the data in the modal", rowData);
      console.log("revision note", rowData.change_note);
      this.selectedBomRevisionNote = rowData.change_note;
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
