<script>
  import IconThumbnail from "../components/IconThumbnail.svelte";
  import { profile } from "../store.js";

  // export let segment;

  let searchResultsDisplay = "none";
  let ajUsers = [];

  const showSearchResults = () => {
    searchResultsDisplay = "grid";
  };

  const hideSearchResults = () => {
    searchResultsDisplay = "none";
  };

  // connect and get data - takes time
  const getData = async () => {
    ajUsers = [];
    //Get fresh data from the api
    let connection = await fetch("http://localhost/users");
    let data = await connection.json();
    console.log(data);
    ajUsers = data;
  };
</script>

<style>
  nav {
    grid-template-columns: 25fr 55fr 20fr;
  }

  .navC1 {
    grid-template-columns: 1fr 5fr;
    min-width: 200px;
  }

  .navC2 {
    max-width: 680px;
    margin: 0 auto;
  }

  .navC3 {
    grid-template-columns: 2fr 1fr 1fr;
  }

  div#searchResults {
    position: absolute;
    width: 100%;
    height: 10rem;
    background: white;
    color: #333;
    border: 1px solid #999;
    border-top: none;
    padding: 0px 0.2rem;
  }

  div#searchContainer {
    position: relative;
    display: grid;
    align-items: center;
  }

  .flex-center i {
    transition: 0.2s ease;
  }

  .flex-center i:hover {
    font-size: 1.3rem;
  }

  .profileIcon {
    transition: 0.2s ease;
    min-width: 100px;
  }

  .profileIcon:hover {
    background: #f2f2f2;
  }
</style>

<nav
  class="fixed grid gap-4 items-center w-full h-16 py-0 px-2 text-gray-700
  bg-white shadow z-10">
  <div class="navC1 grid">
    <!-- aria-current={segment === undefined ? 'page' : undefined} -->
    <a href=".">
      <img
        class="w-12 h-auto rounded-full"
        src="/images/PhoneBook_logo.png"
        alt="CloneBook" />
    </a>
    <div id="searchContainer">
      <form class="relative flex items-center ml-4">
        <i class=" absolute pl-2 fas fa-search" />
        <input
          class="pl-8 h-10 bg-gray-200"
          type="text"
          placeholder="Search on CloneBook"
          on:focus={() => {
            getData();
            showSearchResults();
          }}
          on:blur={hideSearchResults} />
      </form>
      <div id="searchResults" style="display: {searchResultsDisplay};">
        {#each ajUsers as jUser}
          <div>{jUser.firstName} {jUser.lastName}</div>
        {/each}
      </div>
    </div>

  </div>
  <div class="navC2 grid grid-cols-1">
    <svg viewBox="0 0 28 28" height="28" width="28">
      <path
        d="M25.825 12.29C25.824 12.289 25.823 12.288 25.821 12.286L15.027
        2.937C14.752 2.675 14.392 2.527 13.989 2.521 13.608 2.527 13.248 2.675
        13.001 2.912L2.175 12.29C1.756 12.658 1.629 13.245 1.868 13.759 2.079
        14.215 2.567 14.479 3.069 14.479L5 14.479 5 23.729C5 24.695 5.784 25.479
        6.75 25.479L11 25.479C11.552 25.479 12 25.031 12 24.479L12 18.309C12
        18.126 12.148 17.979 12.33 17.979L15.67 17.979C15.852 17.979 16 18.126
        16 18.309L16 24.479C16 25.031 16.448 25.479 17 25.479L21.25
        25.479C22.217 25.479 23 24.695 23 23.729L23 14.479 24.931 14.479C25.433
        14.479 25.921 14.215 26.132 13.759 26.371 13.245 26.244 12.658 25.825
        12.29" />
    </svg>

  </div>
  <div class="navC3 grid gap-4">
    <div class="flex items-center justify-center">
      <a href="/profile">
        <div
          class="profileIcon grid grid-cols-2 gap-2 rounded-full p-2
          cursor-pointer">

          <div class="flex items-center justify-center flex-center">
            <IconThumbnail photoUrl={$profile.photo} width="2.2rem" />
          </div>
          <div class="flex items-center justify-center flex-center">
            <p>{$profile.firstName}</p>
          </div>

        </div>
      </a>

    </div>
    <div
      class="flex items-center justify-center flex-center"
      style="font-size: 1.2rem;">
      <i class="far fa-comment-alt" />
    </div>
    <div class="flex items-center justify-center flex-center">
      <i class="far fa-bell" style="font-size: 1.2rem;" />
    </div>

  </div>
</nav>
