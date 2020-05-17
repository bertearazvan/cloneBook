<script>
  import Nav from "../sections/Nav.svelte";
  import FriendsRight from "../sections/FriendsRight.svelte";
  import PostsContainer from "../sections/PostsContainer.svelte";
  import ChatContainer from "../sections/ChatContainer.svelte";
  import ActionsLeft from "../sections/ActionsLeft.svelte";
</script>

<style>
  #wrapper {
    grid-template-columns: 25fr 55fr 20fr;
  }
</style>

<div id="wrapper" class="grid gap-4">
  <ActionsLeft />
  <div class="flex justify-center">
    <PostsContainer />
  </div>

  <div class="grid chatWrapper mr-4">
    <FriendsRight />
    <ChatContainer />
  </div>

</div>
