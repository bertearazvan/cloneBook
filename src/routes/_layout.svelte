<script>
  import Nav from "../sections/Nav.svelte";
  import PostModal from "../components/PostModal.svelte";
  import ChatContainer from "../sections/ChatContainer.svelte";
  export let segment;

  import { postModal } from "./../store.js";
</script>

<style>

</style>

<svelte:head>
  <link
    href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
    rel="stylesheet" />
  <!-- <script src="/eventsource-polyfill.js">

  </script> -->
</svelte:head>

<Nav {segment} />
<PostModal />
<main>
  <br />
  <br />
  <br />
  <slot />
  <ChatContainer />
  <script
    src="https://kit.fontawesome.com/be2ad1df7f.js"
    crossorigin="anonymous">

  </script>
</main>
