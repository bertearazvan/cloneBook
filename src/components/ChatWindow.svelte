<script>
  import { onMount, afterUpdate } from "svelte";
  import IconThumbnail from "./IconThumbnail.svelte";
  import { profile } from "../store.js";
  import { getRequest } from "./../utils/getRequest.js";
  import io from "socket.io-client";

  const socket = io.connect("http://localhost:3000");

  export let user;
  let active = true;
  export let open;

  let bindMessagesContainer;
  let bindInput;

  $: currentFriend = $profile.friends.find(friend => friend.id === user.id);

  onMount(() => {
    setTimeout(async () => {
      let response = await getRequest("/messages", {
        friendId: currentFriend.id
      });

      // console.log(response.messages);
      currentFriend.chat = response.messages;
      // console.log(currentFriend.username);
      socket.emit("privateRoom", $profile.username, currentFriend.username);
    }, 200);
  });

  afterUpdate(() => {
    if (bindMessagesContainer) {
      bindMessagesContainer.scrollTop =
        bindMessagesContainer.scrollHeight - bindMessagesContainer.clientHeight;
    }
  });

  socket.on("privateMessage", data => {
    console.log("privateMessageEvent", data);

    currentFriend.chat = [
      ...currentFriend.chat,
      {
        isMe: data.from === $profile._id ? true : false,
        message: data.message,
        timestamp: data.timestamp
      }
    ];
    if (data.from === $profile._id) {
      bindInput.value = "";
    }
    bindMessagesContainer.scrollTop =
      bindMessagesContainer.scrollHeight - bindMessagesContainer.clientHeight;

    // console.log(currentFriend.chat);
  });

  // $: if (open || user.activeChat) {
  // }

  // $: setTimeout(() => {
  //   bindMessagesContainer.scrollTop =
  //     bindMessagesContainer.scrollHeight - bindMessagesContainer.clientHeight;
  // }, 200);

  const onSendMessage = e => {
    e.preventDefault();
    console.log($profile._id);
    if (bindInput.value !== "") {
      socket.emit("message", $profile._id, currentFriend.id, bindInput.value);
    }
  };

  const closeChat = e => {
    $profile.activeChats = $profile.activeChats.filter(
      chat => chat.id !== user.id
    );

    socket.emit("leaveRoom", $profile.username, currentFriend.username);
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

  .messagesContainer {
    max-height: 14rem;
    overflow: auto;
    grid-auto-rows: minmax(min-content, max-content);
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
        <div
          bind:this={bindMessagesContainer}
          class="messagesContainer grid grid-cols-1 h-full p-2">
          {#if user.chat.length === 0}
            <p class="text-center">Start this chat now...</p>
          {:else}
            {#each currentFriend.chat as message}
              {#if message.isMe}
                <div class="messageSender">
                  <p
                    class="float-right text-sm rounded-lg mx-0 my-1 p-2
                    font-medium text-white">
                    {@html message.message}
                  </p>
                </div>
              {:else}
                <div class="messageReceiver">
                  <div>
                    <p
                      class="inline-block text-sm rounded-lg mx-0 my-1 p-2
                      font-medium">
                      {@html message.message}
                    </p>
                  </div>
                </div>
              {/if}
            {/each}
          {/if}

        </div>
        <div class="chatInputContainer grid w-full p-1">
          <form class="flex items-center" on:submit={e => onSendMessage(e)}>
            <input
              bind:this={bindInput}
              class="rounded-full h-8 w-full bg-gray-200 p-2"
              type="text"
              placeholder="Message..." />
          </form>
          <div
            class="chatLikeButton flex items-center justify-center
            cursor-pointer"
            on:click={() => {
              bindInput.value = ':like:';
            }}>
            <img src="/images/like.png" style="width: 18px;" alt="like" />
            <!-- <i class=" far fa-thumbs-up" style="color: #0099ff;" /> -->
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
