<script>
  import IconThumbnail from "../components/IconThumbnail.svelte";
  import { profile } from "../store.js";
</script>

<style>
  .actionProfile {
    transition: 0.2s ease;
  }

  .actionProfile:hover {
    background: rgba(101, 103, 107, 0.15);
  }
</style>

<section class="m-2 p-2">
  <div>
    <a href={`profile/${$profile.username}`}>
      <div
        class="actionProfile p-2 cursor-pointer flex items-center rounded-lg
        justify-start">
        <IconThumbnail width="2.5rem" photoUrl={$profile.photo} />

        <p class="ml-2">{$profile.firstName + ' ' + $profile.lastName}</p>

      </div>
    </a>
    <br />
    <div style="border-top: 1px solid rgba(128, 128, 128, 0.2);">Groups</div>
  </div>
</section>
