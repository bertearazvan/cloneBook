<script>
  import IconThumbnail from "../components/IconThumbnail.svelte";
  import Post from "../components/Post.svelte";
  import { profile } from "../store.js";
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
        <input
          class="rounded-full bg-gray-200 p-2"
          placeholder="What's on your mind Razvan?"
          type="text" />
      </div>
      <div class="grid h-12 grid-cols-3 text-gray-600">
        <div
          class="actionTab flex items-center justify-center cursor-pointer
          rounded-lg">
          <img src="/images/action_media.png" alt="profile" />
          <p class="p-2">Photo/Video</p>
        </div>
        <div
          class="actionTab flex items-center justify-center cursor-pointer
          rounded-lg">
          <img src="/images/action_friends.png" alt="profile" />
          <p class="p-2">Tag Friends</p>
        </div>
        <div
          class="actionTab flex items-center justify-center cursor-pointer
          rounded-lg">
          <img src="/images/action_activity.png" alt="profile" />
          <p class="p-2">Feeling/Activity</p>
        </div>
      </div>
    </form>

  </div>
  <section id="postsSectionContainer">
    {#each $profile.posts as post}
      <Post {post} />
    {/each}
  </section>

  <br />
</section>
