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
      <div class="col-md-6 text-end">
        <router-link to="/create-bom">
          <button class="btn btn-primary me-2">Create BOM</button>
        </router-link>
        <router-link to="/bom/upload">
          <button class="btn btn-secondary">Upload BOM</button>
        </router-link>
      </div>
    </div>
    <BomDetails />
  </div>
</template>

<script>
import BomDetails from "../components/BomDetails.vue";
export default {
  components: { BomDetails },
};
</script>

<style lang="scss" scoped></style>
