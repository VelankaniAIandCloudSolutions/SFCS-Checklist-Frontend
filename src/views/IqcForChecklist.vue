<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <div
      class="spinner-border mt-5"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>
      <b> Loading... </b>
    </div>
  </div>
  <div v-else class="container">
    <div class="row align-items-center">
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Checklist</h2>
          <span class="ms-3 fs-4 text-muted me-3">|</span>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent m-0 p-0 justify-content-end">
              <li class="breadcrumb-item">
                <a href="/"> <i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <router-link to="/checklist">
                  <i class="fas fa-list-alt me-1"></i>
                  IQC Checklist</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-spinner me-1"></i>
                Ongoing Checklist
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- <div class="col-md-6 mt-4">
        <div class="container">
          <div class="d-flex justify-content-end">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#generateLabelModal"
              class="btn btn-success me-2"
              v-if="generatedQRCode"
            >
              View Generated Label
            </button>

            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#generateLabelModal"
              class="btn btn-success me-2"
              v-else
            >
              Generate Label
            </button>
            <button class="btn btn-primary me-2" @click="downloadBOM">
              Download BOM
            </button>

            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#endChecklistModal"
              class="btn btn-danger"
            >
              End Checklist
            </button>
          </div>
        </div>
      </div> -->
    </div>

    <div
      class="modal fade"
      id="generateLabelModal"
      tabindex="-1"
      aria-labelledby="generateLabelModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="generateLabelModalLabel">
              Generate Label
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="isChecklistPassed">
              <div id="printable-content" v-if="generatedQRCode">
                <img :src="generatedQRCode" alt="QR Code" />
              </div>
              <p v-else>
                All Checks passed successfully, generate a label by pressing the
                generate button.
              </p>
            </div>
            <div v-else>
              You can only generate a label if all checks are passed
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              Cancel
            </button>
            <div v-if="isChecklistPassed">
              <button
                v-if="generatedQRCode"
                type="button"
                class="btn btn-success"
                @click="printQRCode"
              >
                Print
              </button>
              <button
                v-else
                type="button"
                class="btn btn-success"
                @click="generateQRCode"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="endChecklistModal"
      tabindex="-1"
      aria-labelledby="endChecklistModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="endChecklistModalLabel">
              End Checklist
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to end this checklist?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="endChecklist"
              data-bs-dismiss="modal"
            >
              End
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-primary mb-4 mt-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Bom Details</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div v-if="checklist.bom" class="col">
            <strong>Project Name:</strong>
            {{ checklist.bom.product.project.name }}
          </div>
          <div v-if="checklist.bom" class="col">
            <strong>Product Name:</strong> {{ checklist.bom.product.name }}
          </div>
          <div v-if="checklist.bom" class="col">
            <strong>BOM Rev No:</strong> {{ checklist.bom.bom_rev_number }}
          </div>
          <div v-if="checklist.bom" class="col">
            <strong>Issue Date:</strong> {{ checklist.bom.issue_date }}
          </div>
          <!-- <div class="col">
            <strong>Batch Quantity:</strong> {{ checklist.batch_quantity }}
          </div> -->
        </div>
      </div>
    </div>

    <!-- <div>
        <textarea @input="handleScannerInput" rows="10" cols="30"></textarea>
      </div> -->

    <div class="accordion" id="accordionPanelsStayOpenExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            IQC Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isIqcPassed === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            <IqcChecklistTable
              :checklist_uids="checklist_uids"
              @rowClicked="handleRowClicked"
              @rowSelected="handleRowSelected"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import IqcChecklistTable from "../components/IqcChecklistTable.vue";

export default {
  components: {
    IqcChecklistTable,
  },
  data() {
    return {
      activeBom: "",
      // checklist: "",
      checklistItems: [],

      isIqcPassed: false,

      checklist: [],
      checklist_uids: [],
      selectedRow: [],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      // Fetch BOM data from your API endpoint
      this.$store.commit("setIsLoading", true);

      axios
        .get(`store/get-iqc-data/${this.$route.params.id}`)
        .then((response) => {
          this.checklist = response.data.checklist;
          this.checklist_uids = response.data.checklist_uids;
          console.log(response.data);
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching checklist details:", error);
          this.$store.commit("setIsLoading", false);
        });
    },

    downloadBOM() {
      try {
        // Use the bom_file URL for download

        const bomFileURL = this.checklist.bom.bom_file_url;
        console.log("file url", bomFileURL);
        // Create an anchor element and trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = bomFileURL;

        downloadLink.download = this.checklist.bom.bom_file_name; // Set the desired file name

        document.body.appendChild(downloadLink);

        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (error) {
        console.error("Error downloading BOM:", error);
      }
    },
    handleRowClicked(clickedRow) {
      // Handle the clicked row data in the parent component
      console.log("Clicked Row:", clickedRow);
      // Now you have access to the specific row data, and you can use it as needed.
    },
    handleRowSelected(rowData) {
      console.log("Row Selected:", rowData);
      this.selectedRow = rowData;
    },

    // handleScannerInput(event) {
    //   const inputValue = event.target.value;
    //   console.log(inputValue);
    //   // Check if the input value ends with "Q3000"
    //   if (inputValue.endsWith("Q3000")) {
    //     ue1UUID000130103 - VEPL144380151D < Facts > Q3000;

    //     // Add the scanned entry to the list
    //     this.scannedEntries.push(inputValue);
    //     // Clear the textarea
    //     this.scannedEntries = [];
    //   }
    // },
  },
  watch: {
    checklist_uids: {
      handler(newVal) {
        // Check if all items in the array have iqc_file_url
        this.isIqcPassed = newVal.every((item) => item.iqc_file_url);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
/* Add your custom styles if needed */
</style>
