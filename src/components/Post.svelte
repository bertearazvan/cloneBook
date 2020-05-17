<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  import Comment from "./Comment.svelte";
  import { profile } from "./../store.js";

  let openComments = true;
  let like = false;
  export let post;

  $: currentPost = $profile.posts.filter(
    currentPost => currentPost.id === post.id
  )[0];

  let totalComments = post.comments.length;
  post.comments.forEach(comment => {
    totalComments += comment.replies.length;
  });

  let myLike = post.likes.find(item => item.id === $profile.id);
  if (myLike) {
    like = true;
  }

  const onLikePost = () => {
    let myLike = currentPost.likes.find(item => item.id === $profile.id);
    console.log(currentPost.likes);
    if (myLike === undefined) {
      currentPost.likes = [...currentPost.likes, $profile.public_json];
      like = true;
    } else {
      currentPost.likes = currentPost.likes.filter(
        currentLike => currentLike.id != $profile.id
      );
      like = false;
    }
  };
</script>

<style>
  .postHeader {
    grid-template-columns: 10fr 90fr;
  }

  .postStatusContainer {
    padding: 0.4rem 0.2rem;
    border-bottom: 1px solid rgba(128, 128, 128, 0.4);
  }

  .actionContainerStatus {
    border-bottom: 1px solid rgba(128, 128, 128, 0.4);
  }

  .actionContainerStatus .actionTab {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.5rem;
    margin: 0.3rem 0rem;
    transition: 0.1s ease;
  }

  .actionContainerStatus .actionTab i {
    font-size: 1.1rem;
  }

  .actionTab:hover {
    background-color: rgba(101, 103, 107, 0.15);
  }

  .likeBtn:hover {
    color: #4080ff;
  }

  .postActions {
    margin: 0rem 1rem;
  }
  .commentForm {
    grid-template-columns: 6fr 85fr;
    padding: 1rem 0rem;
    grid-gap: 0.2rem;
  }

  .commentList {
    margin: 0rem 0.5rem;
  }
</style>

<div>
  <div class="postItem w-full mt-4 bg-white rounded-lg shadow">
    <div>
      <div class="postHeader grid p-2">
        <div class="flex items-center justify-center">
          <IconThumbnail photoUrl={post.user.photo} width="2.5rem" />
        </div>

        <div>
          <p>{post.user.firstName + ' ' + post.user.lastName}</p>
          <p class="text-gray-600 font-medium text-sm">{post.timestamp}</p>
        </div>
      </div>
      <div class="mx-3 my-2 font-medium">
        <p>{post.description}</p>
      </div>
    </div>

    <div class="block w-full">
      <img src="/images/post_img.jpg" alt="Post" />
    </div>
    <div class="postActions">
      <div class="postStatusContainer grid grid-cols-2">
        <div class="flex items-center">
          <img
            class="w-5 m-1"
            src="/images/like.svg"
            alt="Facebook like button" />
          <p class="m-1 text-gray-700 font-medium">
            {currentPost.likes.length}
          </p>
        </div>
        <div class="flex justify-end items-center m-2">
          <p
            class="text-gray-500 cursor-pointer"
            on:click={() => (openComments = !openComments)}>
            {totalComments} Comments
          </p>
        </div>

      </div>
      <div class="actionContainerStatus text-gray-600 grid grid-cols-3 h-12">
        <div class="actionTab likeBtn" on:click={onLikePost}>
          <i
            class=" far fa-thumbs-up"
            style={like ? 'color: #2078f4' : 'color: #718096'} />
          <p style={like ? 'color: #2078f4' : 'color: #718096'} class="p-1">
            Like
          </p>
        </div>
        <div class="actionTab">
          <i class="far fa-comment-alt" />
          <p
            class="p-1"
            on:click={() => {
              document.querySelector('#commentInput').focus();
            }}>
            Comment
          </p>
        </div>
        <div class="actionTab">
          <i class="fas fa-share-square" />
          <p class="p-1">Share</p>
        </div>
      </div>
      <div class="commentsContainer">
        <div>
          <div>
            <div class="commentForm flex items-center justify-center">
              <IconThumbnail photoUrl={$profile.photo} width="2.5rem" />
              <input
                id="commentInput"
                class="ml-2 rounded-full bg-gray-200 p-2"
                placeholder="Write a comment..."
                type="text" />
            </div>
            <div class="commentList">
              {#if openComments}
                {#each post.comments as comment}
                  <Comment {comment} postId={post.id} />
                {/each}
              {/if}
            </div>
            <br />
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
