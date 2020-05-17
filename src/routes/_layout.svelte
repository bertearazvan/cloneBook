<script>
  import Nav from "../sections/Nav.svelte";

  export let segment;
</script>

<style>

</style>

<svelte:head>
  <link
    href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
    rel="stylesheet" />
</svelte:head>

<Nav {segment} />

<main>
  <br />
  <br />
  <br />
  <slot />
  <script
    src="https://kit.fontawesome.com/be2ad1df7f.js"
    crossorigin="anonymous">

  </script>
</main>
