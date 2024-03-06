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
                  Checklist</router-link
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
      <div class="col-md-6 mt-4">
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
      </div>
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
        <h4 class="mb-0">Active Bom Details</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div v-if="activeBom.product" class="col">
            <strong>Project Name:</strong> {{ activeBom.product.project.name }}
          </div>
          <div v-if="activeBom.product" class="col">
            <strong>Product Name:</strong> {{ activeBom.product.name }}
          </div>
          <div class="col">
            <strong>BOM Rev No:</strong> {{ activeBom.bom_rev_number }}
          </div>
          <div class="col">
            <strong>Issue Date:</strong> {{ activeBom.issue_date }}
          </div>
          <div class="col">
            <strong>Batch Quantity:</strong> {{ checklist.batch_quantity }}
          </div>
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
            Raw Material Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isRawMaterialSufficient === false"
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
            <CheckListTable
              :checklistItems="filteredChecklistItems['Raw Material']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseTwo"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseTwo"
          >
            PCB Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isPcbSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingTwo"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="filteredChecklistItems['PCB']" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingThree">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseThree"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseThree"
          >
            Solder Paste Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isSolderPasteSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseThree"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingThree"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Solder Paste']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingFour">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseFour"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseFour"
          >
            Solder Bar Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isSolderBarSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseFour"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingFour"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Solder Bar']"
            />>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingFive">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseFive"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseFive"
          >
            Solder Flux Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isSolderFluxSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseFive"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingFive"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Solder Flux']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingSix">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseSix"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseSix"
          >
            IPA Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isIpaSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseSix"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingSix"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="filteredChecklistItems['IPA']" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingSeven">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseSeven"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseSeven"
          >
            Solder Wire Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isSolderWireSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseSeven"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingSeven"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Solder Wire']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingEight">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseEight"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseEight"
          >
            SMT Pallet Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isSMTPalletSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseEight"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingEight"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['SMT Pallet']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingNine">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseNine"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseNine"
          >
            Wave Pallet Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isWavePalletSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseNine"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingNine"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Wave Pallet']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTen">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseTen"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseTen"
          >
            PCB Serial Number Label Check
            <div
              class="spinner-border ms-2"
              role="status"
              v-if="isLabelSufficient === false"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTen"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingTen"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="
                filteredChecklistItems['PCB Serial Number Label']
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckListTable from "../components/CheckListTable"; // Adjust the path based on your actual file structure
import axios from "axios";
import QRCode from "qrcode";

export default {
  components: {
    CheckListTable,
  },
  data() {
    return {
      activeBom: "",
      checklist: "",
      checklistItems: [],

      isChecklistPassed: false,
      isChecklistEnded: false,
      isRawMaterialSufficient: false,
      isPcbSufficient: false,
      isSolderPasteSufficient: false,
      isSolderBarSufficient: false,
      isSolderFluxSufficient: false,
      isIpaSufficient: false,
      isSolderWireSufficient: false,
      isSMTPalletSufficient: false,
      isWavePalletSufficient: false,
      isLabelSufficient: false,

      pollingInterval: "",
      generatedQRCode: "",
      filteredChecklistItems: {
        "Raw Material": [],
        PCB: [],
        "Solder Paste": [],
        "Solder Bar": [],
        "Solder Flux": [],
        Ipa: [],
        "Solder Wire": [],
        "SMT Pallet": [],
        "Wave Pallet": [],
        "PCB Serial Number Label": [],
        // Initialize other types as needed
      },
      scannedEntries: [],
      ws: null,
    };
  },

  mounted() {
    this.getChecklistBeginning();
    // this.pollingInterval = setInterval(() => {
    //   if (!this.isChecklistPassed) {
    //     this.getChecklist();
    //   } else {
    //     clearInterval(this.pollingInterval);
    //     this.$notify({
    //       title: "BOM Check Passed",
    //       type: "bg-success-subtle text-success",
    //       duration: "5000",
    //     });
    //   }
    // }, 5000);
    this.ws = new WebSocket(`ws://192.168.3.95:8000/ws/checklist/`);

    // Event listener for WebSocket connection opened
    this.ws.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    // Event listener for WebSocket messages received
    this.ws.addEventListener("message", (event) => {
      // Parse the received message
      console.log("thi ssi event.data raw ", event.data);
      const data = JSON.parse(event.data);
      console.log("event.data after parsing", data);
      console.log("Received active checklist:", data.active_checklist);

      this.checklist = data.active_checklist;
      this.checklistItems = this.checklist.checklist_items;
      console.log("chehcklist items hereeeeee", this.checklistItems);
      const rawMaterialItems = this.filterChecklistItemsByType("Raw Material");
      const pcbItems = this.filterChecklistItemsByType("PCB");
      const solderPasteItems = this.filterChecklistItemsByType("Solder Paste");
      const solderBarItems = this.filterChecklistItemsByType("Solder Bar");
      const solderFluxItems = this.filterChecklistItemsByType("Solder Flux");
      const IpaItems = this.filterChecklistItemsByType("IPA");
      const stencilItems = this.filterChecklistItemsByType("Solder Wire");
      const smtPalletItems = this.filterChecklistItemsByType("SMT Pallet");
      const wavePalletItems = this.filterChecklistItemsByType("Wave Pallet");
      const labelItems = this.filterChecklistItemsByType(
        "PCB Serial Number Label"
      );
      this.isChecklistPassed = this.checklist.is_passed;
      this.activeBom = this.checklist.bom;
      this.filteredChecklistItems = {
        "Raw Material": rawMaterialItems,
        PCB: pcbItems,
        "Solder Paste": solderPasteItems,
        "Solder Bar": solderBarItems,
        "Solder Flux": solderFluxItems,
        IPA: IpaItems,
        "Solder Wire": stencilItems,
        "SMT Pallet": smtPalletItems,
        "Wave Pallet": wavePalletItems,
        "PCB Serial Number Label": labelItems,
        // Add more types                                                                                                                    as needed
      };
      console.log("filered checklsit items", this.filteredChecklistItems);
      this.isRawMaterialSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "Raw Material"
      );

      this.isPcbSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "PCB"
      );
      this.isSolderPasteSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "Solder Paste"
      );
      this.isSolderBarSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "Solder Bar"
      );
      console.log("checking solder bar", this.isSolderBarSufficient);
      this.isSolderFluxSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "Solder Flux"
      );
      this.isIpaSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "IPA"
      );
      this.isSolderWireSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "Solder Wire"
      );
      this.isSMTPalletSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "SMT Pallet"
      );
      this.isWavePalletSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "Wave Pallet"
      );
      this.isLabelSufficient = this.isItemsSufficient(
        this.filteredChecklistItems,
        "PCB Serial Number Label"
      );

      if (
        this.checklist.status == "Completed" ||
        this.checklist.status == "Failed"
      ) {
        this.isChecklistEnded = true;
      }
      if (this.checklist.qr_code_link) {
        this.generatedQRCode = this.checklist.qr_code_link;
      }

      // Update your Vue component data based on the received checklist items
      // For example:
      // this.checklistItems = data.checklist_items;
    });

    // Event listener for WebSocket connection closed
    this.ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });
  },
  // beforeUnmount() {
  //   clearInterval(this.pollingInterval);
  // },
  beforeUnmount() {
    // Close WebSocket connection when the component is unmounted
    this.ws.close();
  },
  methods: {
    async getChecklistBeginning() {
      this.$store.commit("setIsLoading", true);
      await axios
        .get(`store/get-active-checklist/${this.$route.params.id}/`)
        .then((response) => {
          console.log(response.data);
          this.checklist = response.data.checklist;
          this.checklistItems = this.checklist.checklist_items;
          console.log("checklists items hereeeeee", this.checklistItems);
          const rawMaterialItems =
            this.filterChecklistItemsByType("Raw Material");
          const pcbItems = this.filterChecklistItemsByType("PCB");
          const solderPasteItems =
            this.filterChecklistItemsByType("Solder Paste");
          const solderBarItems = this.filterChecklistItemsByType("Solder Bar");
          const solderFluxItems =
            this.filterChecklistItemsByType("Solder Flux");
          const IpaItems = this.filterChecklistItemsByType("IPA");
          const stencilItems = this.filterChecklistItemsByType("Solder Wire");
          const smtPalletItems = this.filterChecklistItemsByType("SMT Pallet");
          const wavePalletItems =
            this.filterChecklistItemsByType("Wave Pallet");
          const labelItems = this.filterChecklistItemsByType(
            "PCB Serial Number Label"
          );
          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
          this.filteredChecklistItems = {
            "Raw Material": rawMaterialItems,
            PCB: pcbItems,
            "Solder Paste": solderPasteItems,
            "Solder Bar": solderBarItems,
            "Solder Flux": solderFluxItems,
            IPA: IpaItems,
            "Solder Wire": stencilItems,
            "SMT Pallet": smtPalletItems,
            "Wave Pallet": wavePalletItems,
            "PCB Serial Number Label": labelItems,
          };
          console.log("filered checklsit items", this.filteredChecklistItems);
          this.isRawMaterialSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Raw Material"
          );

          this.isPcbSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "PCB"
          );
          this.isSolderPasteSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Paste"
          );
          console.log("checking solder paste", this.isSolderPasteSufficient);

          this.isSolderBarSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Bar"
          );
          console.log("checkinsssg solder bar", this.isSolderBarSufficient);
          this.isSolderFluxSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Flux"
          );
          this.isIpaSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "IPA"
          );
          this.isSolderWireSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Wire"
          );
          this.isSMTPalletSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "SMT Pallet"
          );
          this.isWavePalletSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Wave Pallet"
          );
          this.isLabelSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "PCB Serial Number Label"
          );

          if (
            this.checklist.status == "Completed" ||
            this.checklist.status == "Failed"
          ) {
            this.isChecklistEnded = true;
          }
          if (this.checklist.qr_code_link) {
            this.generatedQRCode = this.checklist.qr_code_link;
          }
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        });
    },
    async getChecklist() {
      await axios
        .get(`store/get-active-checklist/${this.$route.params.id}/`)
        .then((response) => {
          console.log(response.data);
          this.checklist = response.data.checklist;
          this.checklistItems = this.checklist.checklist_items;
          console.log("chehcklist items hereeeeee", this.checklistItems);
          const rawMaterialItems =
            this.filterChecklistItemsByType("Raw Material");
          const pcbItems = this.filterChecklistItemsByType("PCB");
          const solderPasteItems =
            this.filterChecklistItemsByType("Solder Paste");
          const solderBarItems = this.filterChecklistItemsByType("Solder Bar");
          const solderFluxItems =
            this.filterChecklistItemsByType("Solder Flux");
          const IpaItems = this.filterChecklistItemsByType("IPA");
          const stencilItems = this.filterChecklistItemsByType("Solder Wire");
          const smtPalletItems = this.filterChecklistItemsByType("SMT Pallet");
          const wavePalletItems =
            this.filterChecklistItemsByType("Wave Pallet");
          const labelItems = this.filterChecklistItemsByType(
            "PCB Serial Number Label"
          );
          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
          this.filteredChecklistItems = {
            "Raw Material": rawMaterialItems,
            PCB: pcbItems,
            "Solder Paste": solderPasteItems,
            "Solder Bar": solderBarItems,
            "Solder Flux": solderFluxItems,
            IPA: IpaItems,
            "Solder Wire": stencilItems,
            "SMT Pallet": smtPalletItems,
            "Wave Pallet": wavePalletItems,
            "PCB Serial Number Label": labelItems,
            // Add more types                                                                                                                    as needed
          };
          console.log("filered checklsit items", this.filteredChecklistItems);
          this.isRawMaterialSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Raw Material"
          );

          this.isPcbSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "PCB"
          );
          this.isSolderPasteSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Paste"
          );
          this.isSolderBarSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Bar"
          );
          console.log("checking solder bar", this.isSolderBarSufficient);
          this.isSolderFluxSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Flux"
          );
          this.isIpaSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "IPA"
          );
          this.isSolderWireSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Wire"
          );
          this.isSMTPalletSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "SMT Pallet"
          );
          this.isWavePalletSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Wave Pallet"
          );
          this.isLabelSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "PCB Serial Number Label"
          );

          if (
            this.checklist.status == "Completed" ||
            this.checklist.status == "Failed"
          ) {
            this.isChecklistEnded = true;
          }
          if (this.checklist.qr_code_link) {
            this.generatedQRCode = this.checklist.qr_code_link;
          }
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        });
    },
    async endChecklist() {
      this.$store.commit("setIsLoading", true);
      clearInterval(this.pollingInterval);

      await axios
        .get(`store/end-checklist/${this.checklist.id}/`)
        .then((response) => {
          console.log(response.data);
          this.$notify({
            title: "Checklist ended",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.checklist = response.data.checklist;
          //this.checklistItems = this.checklist.checklist_items;
          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
          if (
            this.checklist.status == "Completed" ||
            this.checklist.status == "Failed"
          ) {
            this.isChecklistEnded = true;
          }
          this.$router.push(`/generated-checklists/${this.$route.params.id}`);
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          // clearInterval(this.pollingInterval);
          this.$store.commit("setIsLoading", false);
        });
    },
    async generateQRCode() {
      const uniqueCode = this.generateUniqueCode();
      console.log(uniqueCode);
      const qrCodeDataURL = await QRCode.toDataURL(uniqueCode);
      const postData = {
        uniqueCode: uniqueCode,
        qrCodeDataURL: qrCodeDataURL,
      };
      this.saveQRCode(postData);
    },
    generateUniqueCode() {
      const timestamp = Date.now().toString();
      const randomString = Math.random().toString(36).substring(7);
      return `${timestamp}-${randomString}`;
    },
    async saveQRCode(postData) {
      await axios
        .post(`store/save-qr-code/${this.checklist.id}/`, postData)
        .then((response) => {
          console.log(response.data);
          this.generatedQRCode = postData.qrCodeDataURL;
          this.$notify({
            title: "QR Code generated and saved successfully",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        });
    },
    printQRCode() {
      if (this.generatedQRCode) {
        // Open a new window or tab with the QR code image
        const printableContent = document.getElementById("printable-content");
        const printWindow = window.open("", "", "height=1000,width=1000");
        printWindow.document.write(printableContent.innerHTML);
        printWindow.print();
      }
    },
    filterChecklistItemsByType(type) {
      return this.checklistItems.filter((item) => {
        const itemType = item.checklist_item_type;
        if (itemType && itemType.name) {
          return itemType.name.toUpperCase() === type.toUpperCase();
        }
        return false;
      });
    },
    isItemsSufficient(checklistItems, type) {
      const typeItems = this.filteredChecklistItems[type];
      // Check if there are no items of the specified type
      if (typeItems) {
        if (typeItems.length === 0) {
          return true;
        }

        // Check if all items have sufficient quantity
        const sufficientItems = typeItems.filter((item) => {
          // Assuming 'is_quantity_sufficient' is a property indicating if the quantity is sufficient
          return item.is_quantity_sufficient === true;
        });

        return sufficientItems.length === typeItems.length;
      } else {
        return false;
      }
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
};
</script>

<style lang="scss" scoped>
/* Add your custom styles if needed */
</style>
