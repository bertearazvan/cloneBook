<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  import { profile } from "../store.js";

  export let active = true;
  export let open = true;
  export let user;

  const closeChat = e => {
    $profile.activeChats = $profile.activeChats.filter(
      chat => chat.id !== user.id
    );
    e.stopPropagation();
  };

  const minimizeChat = () => {
    open = false;
    user.activeChat = false;
  };
</script>

<style>
  #chatBarWrapper {
    transition: 0.2s ease;
  }

  #chatBarWrapper:hover {
    background: #f0f2f5;
  }

  #chatBar {
    grid-template-columns: 90fr 10fr;
  }

  .closeChatWindow i {
    transition: 0.1s ease-in;
  }

  .closeChatWindow i:hover {
    font-size: 1.1rem;
  }

  #chatWindowContainer {
    grid-template-rows: 15fr 70fr 15fr;
    height: 32vh;
  }

  .chatHeader {
    grid-template-columns: 8fr 2fr;
    transition: 0.2s ease;
  }

  .chatHeader:hover {
    background: #f0f2f5;
  }

  .chatInputContainer {
    height: 100%;
  }

  .chatInputContainer {
    border-top: 1px solid rgba(201, 208, 218, 0.4);
    grid-template-columns: 88fr 12fr;
  }

  .chatLikeButton {
    font-size: 1.1rem;
    color: #0099ff;
  }

  .messageReceiver p {
    background: #f1f0f0;
    max-width: 70%;
  }

  .messageSender p {
    background: #0099ff;
    max-width: 70%;
  }
</style>

{#if active === true}
  <div class="m-1">
    {#if open === false}
      <div
        id="chatBarWrapper"
        class="flex items-center p-2 w-40 bg-white rounded-b-none rounded-t-lg
        shadow"
        on:click={() => {
          open = true;
        }}>
        <div id="chatBar" class="w-full grid cursor-pointer">
          <div class="flex intems-center">
            <IconThumbnail width="1.4rem" photoUrl={user.photo} />
            <p class="ml-2">{user.firstName}</p>
          </div>

          <div class="closeChatWindow flex items-center justify-end">
            <i class="cursor-pointer m-1 fas fa-times" on:click={closeChat} />
          </div>
        </div>
      </div>
    {:else}
      <div
        id="chatWindowContainer"
        class="grid grid-cols-1 w-64 bg-white rounded-b-none rounded-t-lg shadow">
        <div
          class="chatHeader grid w-full p-2 shadow rounded-b-none rounded-t-lg
          cursor-pointer"
          on:click={minimizeChat}>
          <div class="flex items-center">
            <IconThumbnail width="1.4rem" photoUrl={user.photo} />
            <p class="ml-2">{user.firstName + ' ' + user.lastName}</p>
          </div>
          <div class="closeChatWindow flex items-center justify-end mr-1">
            <i
              class="m-1 fas fa-window-minimize"
              style="font-size: .8rem;"
              on:click={minimizeChat} />
            <i class="m-1 fas fa-times" on:click={closeChat} />
          </div>
        </div>
        <div class="h-full p-2">
          <div class="messageReceiver">
            <div>
              <p
                class="inline-block text-sm rounded-lg mx-0 my-1 p-2 font-medium">
                Hey Razvan!
              </p>
            </div>

          </div>
          <div class="messageSender">
            <p
              class="float-right text-sm rounded-lg mx-0 my-1 p-2 font-medium
              text-white">
              Hey Cassandra!
            </p>
          </div>
        </div>
        <div class="chatInputContainer grid w-full p-1">
          <form class="flex items-center">
            <input
              class="rounded-full h-8 w-full bg-gray-200 p-2"
              type="text"
              placeholder="Message..." />
          </form>
          <div
            class="chatLikeButton flex items-center justify-center
            cursor-pointer">
            <i class=" far fa-thumbs-up" />
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
