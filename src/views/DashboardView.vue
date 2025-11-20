<template>
  <div class="dashboard-container">

    <h2 class="page-title">Dashboard</h2>

    <!-- Cards Grid -->
    <div class="cards-grid">
      <StatsCard
        title="This Month CRM Supports"
        :current="12"
        :total="45"
        :trend="1.3"
        trendText="Up from past week"
      />
      <StatsCard
        title="This Month CRM Supports"
        :current="0"
        :total="2"
        :trend="-4.3"
        trendText="Down from yesterday"
      />
      <StatsCard
        title="This Month Customers"
        :current="0"
        :total="8"
        :trend="1.3"
        trendText="Up from past week"
      />
      <StatsCard
        title="This Month Team Members"
        :current="0"
        :total="9"
        :trend="1.3"
        trendText="Up from past week"
      />
    </div>

  </div>
</template>

<script setup>
import StatsCard from '@/components/Dashboard/StatsCard.vue'
</script>

<style scoped>


.dashboard-container {
  padding: 25px 30px;
  background: #f5f7fb;
  min-height: 100%;
  width: 100%;
  max-width: 100% !important;
  margin: 0 !important;
  display: block;
  padding-top: 10px;


}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(260px, 1fr));
  gap: 22px;
  justify-items: start !important; 
}


.page-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #222;
}


/* Responsive */
@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
