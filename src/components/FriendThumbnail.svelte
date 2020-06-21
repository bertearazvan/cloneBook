<script>
  import { profile } from "./../store.js";
  import { onMount } from "svelte";

  export let friendId;
  export let width = "2rem";
  export let photo;
  let status = 0;

  onMount(() => {
    setTimeout(() => {
      getStatus();
    }, 400);

    setInterval(() => {
      getStatus();
    }, 15000);
  });

  const getStatus = () => {
    let friend = $profile.friends.filter(friend => friend.id === friendId)[0];
    console.log(friend);

    if (friend) {
      status = friend.status;
      photo = friend.photo;
    }

    if (friendId === $profile._id) {
      status = $profile.status;
      photo = $profile.photo;
    }
  };

  $: currentFriend = $profile.friends.filter(
    friend => friend.id === friendId
  )[0];

  // $: status = currentFriend.status;
  // $: status = currentFriend.status;
</script>

<style>
  .status {
    right: 0px;
    bottom: 2px;
    border: 2px solid #f0f2f5;
    background-color: #31a34c;
  }
</style>

<section>
  <!-- {console.log(id)} -->
  <div class="relative h-8 w-8 rounded-full">
    <img
      src={photo}
      style="width:{width}; height: {width};"
      class="h-8 w-8 rounded-full"
      alt="profile" />
    <span
      style={status === 0 ? 'display: none;' : 'display: block;'}
      class="status absolute w-3 h-3 rounded-full" />
  </div>
</section>
