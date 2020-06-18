<script>
  import LoginForm from "../components/LoginForm.svelte";

  import { checkSession } from "./../utils/checkSession.js";
  import { onMount } from "svelte";

  onMount(() => {
    checkSession();
  });
</script>

<style>
  /* ### */
  section {
    height: 50vh;
  }
</style>

<section class="flex items-center justify-center mx-10">
  <div class="grid gap-4 items-center justify-center grid-cols-2">
    <div class="items-center justify-center text-gray-800">
      <h1 class="text-2xl max-w-md mb-8">
        Connect with friends and the world around you on CloneBook
      </h1>
      <div>
        <div class="flex mb-6 items-center">
          <i class="far fa-newspaper text-5xl text-gray-500 text-opacity-75" />

          <p class="ml-4 font-medium">
            <b>See photos and updates</b>
            from friends in News Feed
          </p>
        </div>
        <div class="flex mb-6 items-center">
          <i
            class="fas fa-laptop-code text-5xl text-gray-500 text-opacity-75" />
          <p class="ml-4 font-medium">
            <b>Share what's new</b>
            in your timeline
          </p>
        </div>
        <div class="flex mb-6 items-center">
          <i class="fas fa-cloud text-5xl text-gray-500 text-opacity-75" />
          <p class="ml-4 font-medium">
            <b>Find more</b>
            of what you're looking for with Facebook Search.
          </p>
        </div>

      </div>
    </div>
    <div class="flex items-center justify-center">
      <LoginForm />
    </div>
  </div>
</section>
