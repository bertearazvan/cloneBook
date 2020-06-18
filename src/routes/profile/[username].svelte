<script context="module">
  export async function preload(page, session) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`profile/${page.params.username}.json`);
    const data = await res.json();

    session.profile = data.result;
    // console.log(session);

    if (res.status === 200) {
      return { user: data.result };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import PostsContainer from "./../../sections/PostsContainer.svelte";
  import IconThumbnail from "./../../components/IconThumbnail.svelte";
  import { getRequest } from "./../../utils/getRequest";
  import { postRequest } from "./../../utils/postRequest";
  import { profile, storePosts } from "./../../store.js";
  import { onMount } from "svelte";

  export let user;
  // $profile = user;

  onMount(() => {
    getDataUser();
    getPosts();
    // console.log(currentFriend);
  });

  let coverUrl = "";
  let coverImageFile;

  let profileUrl = "";
  let profileImageFile;

  let hiddenCoverInput;
  let hiddenProfileInput;
  // console.log(user);

  $: currentProfile = $profile._id === user._id ? $profile : undefined;
  $: currentFriend = $profile.friends.find(friend => friend.id === user._id);

  const getDataUser = async () => {
    let response = await getRequest("/profile");
    // console.log(response);
    $profile = response.user;
    // console.log("asdas", response.user);
  };

  const getPosts = async () => {
    let response = await getRequest("/posts");
    // console.log(response.posts);
    $storePosts = response.posts;
    console.log($storePosts);
  };

  const selectCover = e => {
    // console.log(e.target.files[0]);
    coverImageFile = e.target.files[0];
    // console.log(URL.createObjectURL(event.target.files[0]));
    coverUrl = URL.createObjectURL(event.target.files[0]);
  };

  const selectProfile = e => {
    // console.log(e.target.files[0]);
    profileImageFile = e.target.files[0];
    // console.log(URL.createObjectURL(event.target.files[0]));
    profileUrl = URL.createObjectURL(event.target.files[0]);
  };

  const onSaveChangeCover = () => {
    console.log("save");
    currentProfile.coverUrl = "";
  };

  const onSaveChangeProfile = () => {
    console.log("save");
    profileUrl = "";
  };

  const onAddFriend = async () => {
    // console.log($profile.friends);
    let response = await getRequest("/notifications/add", {
      type: "request",
      friendId: user._id
    });

    if (response.type === "success") {
      $profile.friends = [...$profile.friends, response.friend];
    }
  };

  const onSignOut = () => {
    console.log("sign out");
    // let response = getRequest("/users/signout");
    localStorage.clear();
    window.location.href = "/login";
  };

  const onDeleteProfile = () => {
    console.log("delete profile");
  };

  const onRemoveFriend = async () => {
    console.log("remove friend");
    let response = await getRequest("/friends/remove", { friendId: user._id });

    $profile.friends = $profile.friends.filter(
      friend => friend.id !== user._id
    );
  };

  let currentTab = "timeline";
</script>

<style>
  /* ### */
  .containerWrapper {
    width: 70%;
  }

  .coverImage {
    width: 100%;
    height: 40vh;
  }
  .profileImageContainer {
    bottom: -2rem;
    width: 10rem;
    margin-left: -5rem;
    left: 50%;
  }
  .profileImage {
    width: 100%;
    height: 10rem;
    border: 0.3rem solid white;
  }
  .profileName {
    border-bottom: 1px solid rgba(128, 128, 128, 0.5);
  }

  .actionTab {
    height: 4rem;
  }

  .actionTabItem {
    transition: 0.1s ease all;
  }

  .addFriendButton {
    background: #e4e6eb;
    transition: 0.2s ease all;
    cursor: pointer;
  }

  .addFriendButton:hover {
    background: #1877f2;
    color: white;
  }

  .profileContent {
    width: 70%;
  }

  .profileBody {
    grid-template-columns: 4fr 6fr;
  }

  .introBox {
    height: auto;
  }

  .introItems {
    grid-template-columns: 1fr 9fr;
  }

  .friendItem {
    transition: 0.2s ease all;
  }

  .friendItem:hover {
    background: #f0f2f5;
  }

  .changeCoverButton {
    right: 1rem;
    bottom: 0.5rem;
    background: #f0f2f5;
    transition: 0.2s ease all;
    cursor: pointer;
  }

  .changeCoverActions {
    background: #f0f2f5;
    transition: 0.2s ease all;
    cursor: pointer;
  }

  .changeCoverButton:hover {
    background: #e4e6eb;
  }

  .cameraProfileImage,
  .changeProfileActions {
    transition: 0.2s ease all;
    cursor: pointer;
  }

  .cameraProfileImage:hover,
  .changeProfileActions:hover {
    color: #1877f2;
  }

  .defaultButton {
    right: 1rem;
    bottom: 0.5rem;
    background: #1877f2;
    color: white;
  }
</style>

<section
  style="margin-top: -1rem;"
  class="bg-white shadow-md flex justify-center">
  <div class="containerWrapper">
    <div class="profileHeader">
      <div class="relative">
        <div>
          <img
            src={coverUrl ? coverUrl : user.cover}
            alt="cover"
            class="coverImage rounded-lg" />
        </div>
        <div class="profileImageContainer absolute">
          <img
            src={profileUrl ? profileUrl : user.photo}
            alt="profile"
            class="profileImage rounded-full" />
          <div class="w-full flex justify-center">
            {#if $profile._id === user._id}
              {#if profileUrl}
                <p
                  class="changeProfileActions mr-1 cursor-pointer"
                  on:click={() => onSaveChangeProfile()}>
                  Save
                </p>
                <p
                  class="changeProfileActions ml-1 cursor-pointer"
                  on:click={() => {
                    profileUrl = '';
                  }}>
                  Cancel
                </p>
              {:else}
                <i
                  class="cameraProfileImage text-xl fas fa-camera"
                  on:click={() => hiddenProfileInput.click()} />
              {/if}
            {/if}
          </div>
        </div>
        {#if $profile._id === user._id}
          {#if coverUrl}
            <div class="absolute flex" style="right: 1rem; bottom: 0.5rem;">
              <div
                class="changeCoverActions mr-1 flex items-center py-2 px-4
                rounded-md justify-center"
                on:click={() => onSaveChangeCover()}>
                <p>Save</p>
              </div>
              <div
                class="changeCoverActions ml-1 flex items-center py-2 px-4
                rounded-md justify-center"
                on:click={() => (coverUrl = '')}>
                <p>Cancel</p>
              </div>
            </div>
          {:else}
            <div
              class="changeCoverButton flex items-center py-2 px-4 rounded-md
              justify-center absolute"
              on:click={() => hiddenCoverInput.click()}>
              <p>Change cover</p>
            </div>
          {/if}

          <input
            bind:this={hiddenCoverInput}
            accept="image/*"
            type="file"
            alt="hiddenFile"
            style="display: none;"
            on:change={e => selectCover(e)} />
          <input
            bind:this={hiddenProfileInput}
            accept="image/*"
            type="file"
            alt="hiddenFile"
            style="display: none;"
            on:change={e => selectProfile(e)} />
        {/if}
      </div>
      <div class="profileName flex justify-center mx-8 mt-8 pb-6">
        <p class="text-3xl font-black">
          {user.firstName + ' ' + user.lastName}
        </p>
      </div>
      <div class="actionTab grid grid-cols-2 mx-8 px-2">
        <div class="h-full flex items-center justify-start">
          <div
            style={currentTab === 'timeline' ? 'border-bottom: 3px solid rgb(24, 118, 242);' : 'border-bottom: none;'}
            class="actionTabItem h-full p-2 flex cursor-pointer items-center
            justify-center"
            on:click={() => (currentTab = 'timeline')}>
            <p
              style={currentTab === 'timeline' ? 'color: rgb(24, 118, 242);' : 'color: black;'}>
              Timeline
            </p>
          </div>
          <!-- <div
            style={currentTab === 'friends' ? 'border-bottom: 3px solid rgb(24, 118, 242);' : 'border-bottom: none;'}
            class="actionTabItem h-full p-2 flex cursor-pointer items-center
            justify-center"
            on:click={() => (currentTab = 'friends')}>
            <p
              style={currentTab === 'friends' ? 'color: rgb(24, 118, 242);' : 'color: black;'}>
              Friends
            </p>
          </div> -->
        </div>

        <div class="flex items-center justify-end">
          {#if $profile._id !== user._id && !currentFriend}
            <div
              class="addFriendButton rounded-md py-2 m-2 px-10 flex items-center
              justify-center p-4"
              on:click={onAddFriend}>
              <p>Add friend</p>
            </div>
          {/if}

          {#if $profile._id === user._id}
            <div
              class="addFriendButton rounded-md py-2 m-2 px-10 flex items-center
              justify-center p-4"
              on:click={onSignOut}>
              <p>Sign out</p>
            </div>
            <div
              class="addFriendButton rounded-md py-2 m-2 px-10 flex items-center
              justify-center p-4"
              on:click={onDeleteProfile}>
              <p>Delete profile</p>
            </div>
          {/if}

          {#if currentFriend}
            <div
              class="defaultButton rounded-md py-2 m-2 px-10 flex items-center
              justify-center p-4">
              <p>{currentFriend.friendshipStatus}</p>
            </div>
            {#if currentFriend.friendshipStatus === 'accept'}
              <div
                class="addFriendButton rounded-md py-2 m-2 px-10 flex
                items-center justify-center p-4"
                on:click={onRemoveFriend}>
                <p>Remove friend</p>
              </div>
            {/if}
          {/if}

        </div>
      </div>
    </div>

  </div>
</section>

<section class="profileContent mx-auto flex justify-center">
  <div class="grid w-full mt-4 gap-8 profileBody">
    <div>
      <div
        class="introBox pb-8 mt-4 relative bg-white shadow-lg rounded-lg w-full
        p-4">
        <p class="mb-4 text-xl">Intro</p>
        <div class="introItems mb-4 grid gap-2 items-center">
          <i class="text-xl fas fa-globe-americas" />
          <p class="pr-4">Lives in Copenhagen</p>
        </div>
        <div class="introItems mb-4 gap-2 grid items-center">
          <i class="text-xl fas fa-graduation-cap" />
          <p class="pr-4">
            Studies at KEA - Copenhagen School of Design and Technology
          </p>
        </div>
        <div class="introItems gap-2 mb-4 grid items-center">
          <i class="text-xl fas fa-briefcase" />
          <p class="pr-4">Works at DHI</p>
        </div>
      </div>
      <div
        class="friendsBox mt-4 pb-8 relative bg-white shadow-lg rounded-lg
        w-full p-4">
        <p class="mb-4 text-xl">Friends</p>
        {#if user.friends}
          {#each user.friends as friend}
            <div
              class="friendItem px-1 py-2 flex rounded-md cursor-pointer
              items-center justify-start"
              on:click={() => {
                location.href = `/profile/${friend.username}`;
              }}>
              <IconThumbnail photoUrl={friend.photo} width="2.5rem" />
              <p class="pl-2">{friend.firstName} {friend.lastName}</p>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    {#if user.posts}
      <PostsContainer posts={user.posts} />
    {:else}
      <div class="flex justify-center">
        <p>Sorry, there are no posts to show...</p>
      </div>
    {/if}
  </div>
</section>
