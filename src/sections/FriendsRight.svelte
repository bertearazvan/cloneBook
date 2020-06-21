<script>
  import ChatContainer from "./ChatContainer.svelte";
  import FriendThumbnail from "../components/FriendThumbnail.svelte";
  import { profile } from "../store.js";
  import { onMount } from "svelte";
  import { getRequest } from "./../utils/getRequest.js";
  $: friends = $profile.friends.map(friend => friend);

  $: if (friends) {
    checkFriendStatus();
  }

  onMount(() => {
    setInterval(() => checkFriendStatus(), 10000);
  });

  const checkFriendStatus = async () => {
    // console.log($profile.friends);
    for (let i = 0; i < $profile.friends.length; i++) {
      const response = await getRequest("/users/checkStatus", {
        friendId: $profile.friends[i].id
      });

      $profile.friends.find(
        friend => friend.id === $profile.friends[i].id
      ).status = response.status;
    }
    // console.log("friends", friends);
  };

  const showChatWindow = user => {
    let checkFriend = $profile.activeChats.find(
      friend => friend.id === user.id
    );
    // console.log(user);
    if (checkFriend === undefined) {
      user.activeChat = true;
      $profile.activeChats = [...$profile.activeChats, user];
      $profile.activeChats = $profile.activeChats;
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

{#if friends}
  <section class=" w-full mt-4 text-gray-700">
    <div class="wrapper fixed">
      <h4 class="mt-1 text-gray-800">Contacts</h4>
      {#each friends as friend}
        {#if friend.friendshipStatus === 'accept'}
          <div
            class="friendContainer grid gap-2 items-center cursor-pointer"
            on:click={() => showChatWindow(friend)}>
            <FriendThumbnail
              photo={friend.photo}
              status={friend.status}
              friendId={friend.id} />
            <p>{friend.firstName + ' ' + friend.lastName}</p>
          </div>
        {/if}
      {/each}
    </div>

  </section>
{/if}
