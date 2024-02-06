<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="bomByProducts"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      @selectionChanged="onSelectionChanged"
      rowSelection="single"
    >
    </ag-grid-vue>
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
  name: "OrderBomDetails",
  components: {
    AgGridVue,
  },
  props: {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    bomByProducts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Add more rows as needed

      colDefs: [
        {
          field: "id",
          // headerCheckboxSelection: true,
          checkboxSelection: true,

          headerName: "BOM ID",
        },

        {
          field: "bom_rev_number",

          headerName: "Bom Rev No.",
        },
        {
          field: "change_note",
          headerName: "BOM Revision Note",
          valueFormatter: (params) => {
            // Check if change note is present
            if (params.value) {
              return params.value; // If change note is present, return the value as it is
            } else {
              return "Change Note Absent"; // If change note is not present, return "No change note"
            }
          },
        },
        {
          field: "product.project.name",

          headerName: "Project Name",
        },
        {
          field: "product.name",

          headerName: "Product Name",
        },

        {
          field: "product.product_code",
          headerName: "Product Code",
        },
        {
          field: "bom_type.name",
          headerName: "BOM Type",
        },

        { field: "issue_date", headerName: "Issue Date" },
        {
          field: "product.product_rev_number",
          headerName: "Product Rev No",
        },

        {
          headerName: "Download",
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
      selectedBomRevisionNote: "",
    };
  },

  methods: {
    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
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
      button.innerHTML = `<i class="fas fa-download"></i> ${params.data.bom_file_name} `;
      button.classList.add("btn-sm", "btn-primary");

      // Disable the button if no rows are selected or if more than one row is selected
      button.addEventListener("click", () =>
        this.downloadFile(params.data.bom_file_url)
      );
      return button;
    },
    downloadFile(fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank"; // Open in a new tab
      link.download = "BOM_File"; // You can set a default filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    onEditClick(id) {
      this.$router.push(`/bom/edit/${id}`);
    },
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
<style scoped></style>
