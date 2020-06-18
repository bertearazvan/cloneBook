<script>
  import IconThumbnail from "../components/IconThumbnail.svelte";
  import Post from "../components/Post.svelte";
  import { profile, storePosts, postModal } from "../store.js";

  // $: posts = $profile.posts;
  export let posts;
  // console.log($storePosts);

  const onOpenModal = () => {
    $postModal.show = true;
    console.log($postModal);
  };
</script>

<style>
  section {
    max-width: 680px;
  }

  #postInput {
    grid-template-columns: 6fr 85fr;
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  }

  .actionTab {
    margin: 0.3rem 0rem;
    transition: 0.1s ease;
  }

  .actionTab:hover {
    background-color: rgba(101, 103, 107, 0.15);
  }
</style>

<section class="m-4">

  <div id="postFormContainer" class="bg-white h-32 p-3 shadow rounded-lg">
    <form>
      <div id="postInput" class="grid pb-4">
        <IconThumbnail photoUrl={$profile.photo} width="2.5rem" />
        <div
          class="rounded-full w-full bg-gray-200 p-2 cursor-pointer"
          on:click={onOpenModal}>
          <p class="text-gray-500">What's on your mind {$profile.firstName}?</p>
        </div>

      </div>
      <div class="grid h-12 grid-cols-3 text-gray-600">
        <div
          class="actionTab flex items-center justify-center cursor-pointer
          rounded-lg">
          <img src="/images/action_media.png" alt="profile" />
          <p class="p-2" on:click={onOpenModal}>Photo/Video</p>
        </div>
        <div
          class="actionTab flex items-center justify-center cursor-pointer
          rounded-lg">
          <img src="/images/action_friends.png" alt="profile" />
          <p class="p-2" on:click={onOpenModal}>Tag Friends</p>
        </div>
        <div
          class="actionTab flex items-center justify-center cursor-pointer
          rounded-lg">
          <img src="/images/action_activity.png" alt="profile" />
          <p class="p-2" on:click={onOpenModal}>Feeling/Activity</p>
        </div>
      </div>
    </form>

  </div>
  <section id="postsSectionContainer">
    {#if posts}
      {#each posts as post}
        <Post {post} />
      {/each}
    {/if}
  </section>

  <br />
</section>
