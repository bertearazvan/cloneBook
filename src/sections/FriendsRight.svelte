<script>
  import ChatContainer from "./ChatContainer.svelte";
  import FriendThumbnail from "../components/FriendThumbnail.svelte";
  import { profile } from "../store.js";
  $: friends = $profile.friends.map(friend => friend);

  const showChatWindow = user => {
    // console.log("showing chat window");
    // addChatWindow(friend);

    let checkFriend = $profile.activeChats.find(
      friend => friend.id === user.id
    );
    console.log(user);
    if (checkFriend === undefined) {
      user.activeChat = true;
      $profile.activeChats = [...$profile.activeChats, user];
      $profile.activeChats = $profile.activeChats;
      // let copy = $profile.activeChats;
      // $profile.activeChats = [];
      // $profile.activeChats = copy;
    }
  };
</script>

<style>
  section {
    border-top: 1px solid rgba(128, 128, 128, 0.4);
  }

  .friendContainer {
    grid-template-columns: 15fr 85fr;
    margin: 1rem 0rem;
  }

  .wrapper {
    max-height: 90vh;
    overflow: auto;
  }
</style>

<section class=" w-full mt-4 text-gray-700">
  <div class="wrapper fixed">
    <h4 class="mt-1 text-gray-800">Contacts</h4>
    {#each friends as friend}
      {#if friend.friendshipStatus === 'accept'}
        <div
          class="friendContainer grid gap-2 items-center cursor-pointer"
          on:click={() => showChatWindow(friend)}>
          <FriendThumbnail status={friend.status} photoUrl={friend.photo} />
          <p>{friend.firstName + ' ' + friend.lastName}</p>
        </div>
      {/if}
    {/each}
  </div>

</section>
