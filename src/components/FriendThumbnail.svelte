<script>
  export let status;
  export let photoUrl;
</script>

<style>
  .status {
    right: 0px;
    bottom: 2px;

    border: 2px solid #f0f2f5;
    background-color: #31a34c;
  }
</style>

<section>
  <!-- {console.log(id)} -->
  <div class="relative h-8 w-8 rounded-full">
    <img src={photoUrl} class="h-8 w-8 rounded-full" alt="profile" />
    <span
      style={status === 0 ? 'display: none;' : 'display: block;'}
      class="status absolute w-3 h-3 rounded-full" />
  </div>
</section>
