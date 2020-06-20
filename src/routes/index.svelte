<script>
  import Nav from "../sections/Nav.svelte";
  import FriendsRight from "../sections/FriendsRight.svelte";
  import PostsContainer from "../sections/PostsContainer.svelte";
  import ChatContainer from "../sections/ChatContainer.svelte";
  import ActionsLeft from "../sections/ActionsLeft.svelte";

  import { getRequest } from "./../utils/getRequest.js";
  import { checkSession } from "./../utils/checkSession.js";

  import { profile } from "./../store.js";
  import { storePosts } from "./../store.js";
  import { onMount } from "svelte";

  // import EventSource from "eventsource";
  // // // var EventSource = require("eventsource");

  // let eventSource = new EventSource("http://localhost:3000/sse");
  // // // eventSource.addEventListener("message", e => {});

  // eventSource.onmessage = data => {
  //   // let user = JSON.parse(data.data);
  //   $profile = { ...JSON.parse(data.data) };
  //   // $profile = $profile;
  //   console.log($profile);
  // };

  $: loading = true;

  onMount(() => {
    getDataUser();
    getPosts();
    getSession();
  });

  const getSession = async () => {
    let response = await getRequest("/users/session");
    if (response.type !== "success" || !localStorage.getItem("token")) {
      location.href = `/login`;
    }
  };

  const getPosts = async () => {
    let response = await getRequest("/posts");
    console.log(response.posts);
    $storePosts = response.posts;
    loading = false;
  };

  const getDataUser = async () => {
    let response = await getRequest("/profile");
    // console.log(response);
    $profile = response.user;
    console.log($profile);
  };

  // $: posts = $storePosts;
  // console.log($storePosts);
</script>

<style>
  #wrapper {
    grid-template-columns: 25fr 55fr 20fr;
  }

  .chatWrapper {
    min-height: 90vh;
    overflow: auto;
  }
</style>

<div id="wrapper" class="grid gap-4">
  <ActionsLeft />
  <div class="flex justify-center">
    <PostsContainer posts={$storePosts} />
  </div>

  <div class="grid chatWrapper mr-4">
    <FriendsRight />
  </div>

</div>
