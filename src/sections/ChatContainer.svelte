<script>
  import ChatWindow from "../components/ChatWindow.svelte";
  import { profile } from "../store.js";
</script>

<style>
  section {
    bottom: 0px;
    left: 0px;
    width: 70%;
  }
</style>

<section class="fixed flex justify-end items-end h-auto">
  {#each $profile.activeChats as chat}
    <ChatWindow user={chat} open={chat.activeChat === false ? false : true} />
  {/each}

</section>
