<template>
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Reports</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-chart-bar me-1"></i>
                Reports
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
    <div class="conatiner">
      <ul class="list-group pt-4">
        <router-link
          class="list-group-item list-group-item-action text-left"
          to="/checklist-report"
        >
          Checklist Report
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" scoped></style>
