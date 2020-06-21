<script>
  // ####
  import { profile } from "./../store.js";
  import IconThumbnail from "./IconThumbnail.svelte";
  import FriendThumbnail from "./FriendThumbnail.svelte";
  import { getRequest } from "./../utils/getRequest";
  import { fromNowOrNow } from "./../utils/fromNowOrNow";
  import { onMount } from "svelte";
  import moment from "moment";

  onMount(async () => {
    setInterval(() => {
      checkForNotifications();
      checkForMessages();
    }, 10000);
    // console.log(response);
  });

  let showActionsBox;
  let bindBoxActions;
  let showRequestActions = true;

  $: activeAction = "";
  $: boxContent = [];
  $: newNotifications = "";
  $: newMessages = "";

  const checkForNotifications = async () => {
    let response = await getRequest("/notifications");

    if (
      response.notifications.filter(notif => notif.user.id !== $profile._id)
        .length >
      $profile.notifications.filter(notif => notif.user.id !== $profile._id)
        .length
    ) {
      newNotifications =
        response.notifications.length - $profile.notifications.length;
    }
  };

  const checkForMessages = async () => {
    let response = await getRequest("/friends");
    let accumulator = 0;
    if (response.type === "success") {
      for (let i = 0; i < $profile.friends.length; i++) {
        for (let j = 0; j < response.friends.length; j++) {
          if (
            $profile.friends[i].chat.length < response.friends[j].chat.length &&
            $profile.friends[i].username === response.friends[j].username
          ) {
            accumulator +=
              response.friends[j].chat.length - $profile.friends[i].chat.length;
          }
        }
      }
      // console.log(accumulator);
      newMessages = accumulator;
    }
  };

  const getNotifications = async () => {
    activeAction = "notifications";

    let friends = await getRequest("/friends");
    let response = await getRequest("/notifications");

    $profile.friends = friends.friends;
    $profile.notifications = response.notifications;

    let reducedNotifications = $profile.notifications.reduce(
      (accumulator, item) => {
        if (item.type === "request") {
          let findNotification = accumulator.find(
            notif => notif.type === "request" && notif.user.id === item.user.id
          );

          if (!findNotification) {
            accumulator = [...accumulator, item];
          }
        } else {
          accumulator = [...accumulator, item];
        }

        return accumulator;
      },
      []
    );
    console.log(reducedNotifications);
    boxContent = reducedNotifications.filter(
      notif => notif.user.id !== $profile._id
    );

    newNotifications = "";
    showActionsBox = true;

    setTimeout(() => {
      bindBoxActions.focus();
    }, 200);

    // console.log(boxContent);
  };

  const getMessages = async () => {
    activeAction = "messages";
    let response = await getRequest("/friends");

    response.friends = response.friends.sort((a, b) => {
      if (a.chat.length > 0 && b.chat.length > 0) {
        console.log(
          new Date(a.chat[a.chat.length - 1].timestamp) -
            new Date(b.chat[b.chat.length - 1].timestamp)
        );
        return (
          new Date(b.chat[b.chat.length - 1].timestamp) -
          new Date(a.chat[a.chat.length - 1].timestamp)
        );
      } else {
        return -1;
      }
    });
    $profile.friends = response.friends;

    newMessages = "";
    boxContent = $profile.friends;
    showActionsBox = true;
    setTimeout(() => {
      bindBoxActions.focus();
    }, 200);
  };

  const showChatWindow = user => {
    // console.log("showing chat window");
    // addChatWindow(friend);

    let checkFriend = $profile.activeChats.find(
      friend => friend.id === user.id
    );
    if (checkFriend === undefined) {
      user.activeChat = true;
      $profile.activeChats = [user, ...$profile.activeChats];
    }
    showActionsBox = false;
  };

  const onAccept = async item => {
    // we update both of the users with the latest friendshipStatus = 1
    let response = await getRequest("/notifications/accept", {
      friendId: item.user.id
    });

    if (response.type === "success") {
      // console.log("success");
      let foundIndexFriend = $profile.friends.findIndex(
        friend => friend.id === item.user.id
      );
      // console.log(item.user.id, $profile.friends);
      if (foundIndexFriend > 0) {
        $profile.friends[foundIndexFriend].friendshipStatus = "accept";
      }
      showRequestActions = false;
      // console.log($profile.friends, item.user);
    }
    // we want to get message, success, friendId
  };

  const onDecline = async item => {
    // showRequestActions = false;
    // we update both of the users with the latest friendshipStatus = 3
    let response = await getRequest("/notifications/decline", {
      friendId: item.user.id
    });
    if (response.type === "success") {
      // console.log("success");
      let foundIndexFriend = $profile.friends.findIndex(
        friend => friend.id === item.user.id
      );
      if (foundIndexFriend > 0) {
        $profile.friends[foundIndexFriend].friendshipStatus = "decline";
      }
      showRequestActions = false;
      // console.log($profile.friends, item.user);
    }

    // we want to get message, success, friendId
  };

  const onSignOut = async () => {
    // sign out from backend

    let response = await getRequest("/users/signOut");
    if (response.type === "success") {
      console.log("sign out");
      localStorage.clear();
      window.location.href = "/login";
    }
  };
</script>

<style>
  .actionButtonsNav {
    background: #f0f2f5;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    transition: 0.3s ease all;
    margin: 0px 0.5rem;
  }

  /* Small (sm) */
  @media (max-width: 640px) {
    /* ... */
    .actionButtonsNav {
      width: 2rem;
      height: 2rem;
    }
  }

  .actionButtonsNav:hover {
    background: #e4e6eb;
  }

  .actionsBox {
    width: 20rem;
    background: white;
    max-height: 45vh;
    overflow: auto;
    right: 1rem;
    outline: 0px;
  }

  .contentBoxItem {
    min-height: 4rem;
    transition: 0.3s ease all;
  }

  .contentBoxItem:hover {
    background: #f0f2f5;
  }

  .notificationItem {
    grid-template-columns: 2fr 8fr;
  }

  .notificationTimestamp {
    color: rgb(24, 118, 242);
  }

  .requestButton {
    background: #e4e6eb;
    transition: 0.3s ease all;
  }

  .requestButtonAccept:hover {
    background: rgb(24, 118, 242);
    color: white;
  }
  .requestButtonDecline:hover {
    background: #e02200;
    color: white;
  }
  .dot {
    height: 5px;
    width: 5px;
    background-color: #bbb;
    border-radius: 50%;
  }

  .counterCircle {
    background: red;
    top: 0;
    right: 0;
    border-radius: 50%;
    width: 1.2rem;
    height: 1.2rem;
    color: white;
    font-size: 12px;
  }
</style>

<div>

  <div class="flex items-center justify-center">
    <div
      class="actionButtonsNav relative flex items-center justify-center"
      on:click={getMessages}
      style={activeAction === 'messages' && 'background-color: #E7F3FF;'}>
      <svg viewBox="0 0 28 28" height="20" width="20">
        <path
          d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091
          13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0
          0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0
          1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0
          .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0
          2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0
          1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"
          fill={activeAction === 'messages' ? 'rgb(24, 118, 242)' : 'black'} />
      </svg>
      {#if newMessages > 0}
        <span class="absolute flex items-center justify-center counterCircle">
          <p>{newMessages}</p>
        </span>
      {/if}
    </div>

    <div class="">
      <div
        class="actionButtonsNav relative flex items-center justify-center"
        on:click={getNotifications}
        style={activeAction === 'notifications' && 'background-color: #E7F3FF;'}>
        <svg viewBox="0 0 28 28" height="20" width="20">
          <path
            d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944
            24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825
            23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27
            19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285
            22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574
            21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278
            16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022
            6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977
            20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348
            12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"
            fill={activeAction === 'notifications' ? 'rgb(24, 118, 242)' : 'black'} />
        </svg>
        {#if newNotifications}
          <span class="absolute flex items-center justify-center counterCircle">
            <p>{newNotifications}</p>
          </span>
        {/if}
      </div>
    </div>
    <div
      class="actionButtonsNav relative flex items-center justify-center"
      on:click={onSignOut}>
      <i class="fas fa-sign-out-alt" style="font-size: 1.1rem; color: black;" />
    </div>
  </div>
  {#if showActionsBox}
    <div
      bind:this={bindBoxActions}
      class="actionsBox grid grid-cols-1 absolute mt-4 shadow-lg rounded-lg p-2"
      tabindex="0"
      on:blur={() => {
        showActionsBox = false;
        activeAction = undefined;
      }}>

      {#each boxContent as item}
        {#if activeAction === 'notifications'}
          <div class="contentBoxItem flex items-center cursor-pointer">
            <div class="notificationItem w-full h-full grid gap-1">
              <div class="flex items-center justify-center">
                <FriendThumbnail
                  width="2rem"
                  photo={item.user.photo}
                  friendId={item.user.id} />
                <!-- {console.log(item)}
                <IconThumbnail photoUrl={item.user.photo} width="2.6rem" /> -->
              </div>
              <div>
                {#if item.type === 'request'}
                  <div class="p-2">
                    <p class="flex items-center">
                      {item.user.firstName + ' ' + item.user.lastName + ' '}
                      <span class="mx-1 dot" />
                      <span class="notificationTimestamp font-normal text-sm">
                        {' ' + fromNowOrNow(item.timestamp)}
                      </span>
                    </p>
                    <p class="font-normal">{item.body}</p>
                    {#if showRequestActions && !$profile.friends.find(friend => friend.id === item.user.id && friend.friendshipStatus !== 'pending')}
                      <div class="grid grid-cols-2 gap-1">
                        <div
                          class="requestButton requestButtonAccept p-1 m-1
                          rounded-md shadow-md flex items-center justify-center"
                          on:click={onAccept(item)}>
                          <p>Accept</p>
                        </div>
                        <div
                          class="requestButton requestButtonDecline p-1 m-1
                          rounded-md shadow-md flex items-center justify-center"
                          on:click={onDecline(item)}>
                          <p>Decline</p>
                        </div>
                      </div>
                    {/if}
                  </div>
                {:else if item.type === 'like'}
                  <div class="p-2">
                    <p class="flex items-center">
                      {item.user.firstName + ' ' + item.user.lastName + ' '}
                      <span class="mx-1 dot" />
                      <span class="notificationTimestamp font-normal text-sm">
                        {' ' + fromNowOrNow(item.timestamp)}
                      </span>
                    </p>
                    <p class="font-normal">{item.body}</p>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {:else if item.chat.length > 0}
          <div class="contentBoxItem flex items-center cursor-pointer">
            <div
              class="notificationItem w-full h-full grid gap-1"
              on:click={showChatWindow(item)}>
              <div class="flex items-center justify-center">

                <FriendThumbnail
                  width="2rem"
                  photo={item.photo}
                  friendId={item.id} />
              </div>
              <div class="p-2">
                <p class="flex items-center">
                  {item.firstName + ' ' + item.lastName + ' '}
                  <span class="mx-1 dot" />
                  <span class="notificationTimestamp font-normal text-sm">
                    {' ' + fromNowOrNow(item.chat[item.chat.length - 1].timestamp)}
                  </span>
                </p>
                <p class="font-normal">
                  {@html item.chat[item.chat.length - 1].message}
                </p>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
