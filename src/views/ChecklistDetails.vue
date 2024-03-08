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
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Checklist Details</h2>
          <span class="ms-3 fs-4 text-muted me-3">|</span>
          <nav aria-label="breadcrumb" class="flex-grow-1">
            <ol class="breadcrumb bg-transparent m-0 p-0 d-flex flex-wrap">
              <li class="breadcrumb-item">
                <router-link to="/checklist">
                  <i class="fas fa-list-alt me-1"></i>
                  Checklist
                </router-link>
              </li>
              <li class="breadcrumb-item">
                <a
                  v-if="
                    this.checklist &&
                    this.checklist.bom &&
                    this.checklist.bom.id
                  "
                  :href="'/generated-checklists/' + this.checklist.bom.id"
                >
                  <i class="fas fa-list-alt me-1"></i>
                  Generated Checklists
                </a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa-solid fa-list-check me-1"></i>
                Checklist Details
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="col-md-6 mt-4 d-flex justify-content-end">
        <div class="container">
          <div class="d-flex justify-content-end">
            <button
              v-if="this.checklist && this.checklist.status === 'Paused'"
              type="button"
              class="btn btn-success me-2"
              @click="resumeChecklist"
            >
              Resume Checklist
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

    <div class="card border-primary mb-4 mt-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">BOM Details</h4>
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
        </div>
      </div>
    </div>
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
            Raw Material
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isRawMaterialSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isPcbSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            Solder Paste
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isSolderPasteSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            Solder Bar
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isSolderBarSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            Solder Flux
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isSolderFluxSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
            </div>
          </button>
        </h2>
        <div
          data-bs-toggle="modal"
          data-bs-target="#generateLabelModal"
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
            IPA
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isIpaSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            Solder Wire
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isSolderWireSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            SMT Pallet
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isSMTPalletSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            Wave Pallet
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isWavePalletSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
            PCB Serial Number Label
            <div v-if="this.checklist.status == 'Paused'">
              <i class="fas fa-pause-circle fs-4 ms-2"></i>
            </div>
            <div v-else>
              <div v-if="isLabelSufficient == false">
                <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
              </div>
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
      isChecklistPassed: false,
      isChecklistEnded: false,
      pollingInterval: "",
      filteredChecklistItems: {
        "Raw Material": [],
        PCB: [],
        "Solder Paste": [],
        "Solder Bar": [],
        "Solder Flux": [],
        IPA: [],
        "Solder Wire": [],
        "SMT Pallet": [],
        "Wave Pallet": [],
        "PCB Serial Number Label": [],
        // Initialize other types as needed
      },
      generatedQRCode: "",
    };
  },
  mounted() {
    this.getChecklist();
  },
  methods: {
    async getChecklist() {
      this.$store.commit("setIsLoading", true);
      await axios
        .get(`store/get-checklist-details/${this.$route.params.id}/`)
        .then((response) => {
          console.log("yehh", response.data);
          this.checklist = response.data.checklist;
          this.checklistItems = this.checklist.checklist_items;
          console.log("chehcklist hereeeeee", this.checklist);
          console.log("chehcklist items hereeeeee", this.checklistItems);
          const rawMaterialItems =
            this.filterChecklistItemsByType("Raw Material");

          console.log(rawMaterialItems);

          const pcbItems = this.filterChecklistItemsByType("PCB");
          const solderPasteItems =
            this.filterChecklistItemsByType("Solder Paste");
          const solderBarItems = this.filterChecklistItemsByType("Solder Bar");
          const solderFluxItems =
            this.filterChecklistItemsByType("Solder Flux");
          const IpaItems = this.filterChecklistItemsByType("IPA");
          const stencilItems = this.filterChecklistItemsByType("Solder Wire");
          const SMTPalletItems = this.filterChecklistItemsByType("SMT Pallet");
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
            "SMT Pallet": SMTPalletItems,
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

          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
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
    filterChecklistItemsByType(type) {
      return this.checklistItems.filter((item) => {
        const itemType = item.checklist_item_type;
        if (itemType && itemType.name) {
          return itemType.name.toLowerCase() === type.toLowerCase();
        }
        return false;
      });
    },
    isItemsSufficient(checklistItems, type) {
      const typeItems = this.filteredChecklistItems[type];
      if (typeItems.length === 0) {
        return true;
      }
      const sufficientItems = typeItems.filter((item) => {
        return item.is_quantity_sufficient === true;
      });

      return sufficientItems.length === typeItems.length;
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
        const printableContent = document.getElementById("printable-content");
        const printWindow = window.open("", "", "height=1000,width=1000");
        printWindow.document.write(printableContent.innerHTML);
        printWindow.print();
      }
    },
    resumeChecklist() {
      // Send a request to resume the checklist
      this.$store.commit("setIsLoading", true);
      console.log("this is the checklist id", this.checklist.id);
      axios
        .post(`/store/resume-checklist/${this.checklist.id}/`)
        .then((response) => {
          // Handle success response
          console.log(response.data.message);

          // Check if the response contains a success message
          if (response.status === 200) {
            // Redirect to checklist-details page with checklist id
            this.$router.push(`/begin-checklist/${this.checklist.bom.id}`);

            // Display success message
            this.$notify({
              title: response.data.message,
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
          } else {
            // Display error message
            this.$notify({
              title: response.data.error,
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          }

          // Optionally, update your UI or perform any other actions
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          // Handle error response
          console.error("An error occurred:", error.response.data);
          // Display an error message to the user
          this.$notify({
            title: error.response.data.error,
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/* Add your custom styles if needed */
</style>
