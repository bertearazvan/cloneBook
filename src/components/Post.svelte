<script>
  import { onMount } from "svelte";

  import { getRequest } from "./../utils/getRequest";
  import { postRequest } from "./../utils/postRequest";
  import { fromNowOrNow } from "./../utils/fromNowOrNow";
  import { profile, storePosts, postModal } from "./../store.js";

  import IconThumbnail from "./IconThumbnail.svelte";
  import Comment from "./Comment.svelte";
  import EditDots from "./EditDots.svelte";

  let openComments = true;
  let like = false;
  let commentInput;
  export let post;
  // console.log(post);
  onMount(() => {
    like = false;
    setInterval(() => {
      checkLikes();
    }, 3000);
  });

  // console.log($profile, $storePosts);

  $: currentPost = $storePosts.filter(
    currentPost => currentPost._id === post._id
  )[0];

  $: totalComments = currentPost && currentPost.comments.length;
  $: post.comments.forEach(comment => {
    totalComments += comment.replies.length;
  });

  $: myLike =
    currentPost && currentPost.likes.find(item => item.id === $profile._id);
  $: if (myLike) {
    like = true;
  }

  const checkLikes = async () => {
    let response = await getRequest("/posts/likes", {
      userId: currentPost.user.id,
      postId: currentPost._id
    });

    if (response.likes.length !== currentPost.likes.length) {
      // console.log(response);
      currentPost.likes = response.likes;
    }
  };

  const onLikePost = async () => {
    // let myLike = currentPost.likes.find(item => item.id === $profile.id);
    // console.log(currentPost.likes);
    // console.log(currentPost);

    let form = new FormData();
    form.append("postId", currentPost._id);
    form.append("user", JSON.stringify(currentPost.user));

    let response = await postRequest("/posts/likes", form);
    console.log(response);

    if (response.type === "success") {
      if (myLike === undefined) {
        currentPost.likes = [...currentPost.likes, $profile.public_json];
        like = true;
      } else {
        currentPost.likes = currentPost.likes.filter(
          currentLike => currentLike.id != $profile._id
        );
        like = false;
      }
    }
  };

  const deleteComment = id => {
    // console.log(id);
    currentPost.comments = currentPost.comments.filter(
      comment => comment.id !== id
    );

    post.comments = post.comments.filter(comment => comment.id !== id);
  };

  const onAddComment = e => {
    e.preventDefault();
    let newComment = {
      id: currentPost.comments.length + 1,
      comment_body: commentInput.value,
      likes: [],
      post_id: currentPost.id,
      replies: [],
      timestamp: "now",
      user: $profile.public_json
    };
    commentInput.value = "";
    // post.comments = [newComment, ...post.comments];
    // console.log(commentInput.value);
    currentPost.comments = [...currentPost.comments, newComment];
    currentPost.comments = currentPost.comments;
    console.log(currentPost.comments);
  };

  const onEditPost = () => {
    console.log("edit post");
    $postModal.postData = currentPost._id;
    $postModal.show = true;
    // console.log($postModal.postData);
  };

  const onDeletePost = async () => {
    console.log("delete post");
    let response = await getRequest("/posts/delete", {
      postId: currentPost._id
    });

    if (response.type === "success") {
      $storePosts = $storePosts.filter(post => post._id !== currentPost._id);
    }
    // $profile.posts = $profile.posts;
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

  /* .commentList {
    margin: 0rem 0.5rem;
  } */

  .editPostButton {
    right: 0.7rem;
    top: 0.3rem;
  }
</style>

{#if currentPost}
  <div>
    <div class="postItem w-full mt-4 bg-white rounded-lg shadow">
      <div>
        <div class="relative postHeader grid p-2">
          <div
            class="flex cursor-pointer items-center justify-center"
            on:click={() => (window.location.href = `profile/${currentPost.user.username}`)}>
            <IconThumbnail photoUrl={currentPost.user.photo} width="2.5rem" />
          </div>

          <div>
            <p>
              {currentPost.user.firstName + ' ' + currentPost.user.lastName}
            </p>
            <p class="text-gray-600 font-medium text-sm">
              {fromNowOrNow(currentPost.timestamp)}
            </p>
          </div>
          <div class="editPostButton absolute">
            <EditDots
              openEdit={currentPost.user.id === $profile._id ? true : false}
              onEdit={onEditPost}
              onDelete={onDeletePost} />
          </div>
        </div>
        <div class="mx-3 my-2 font-medium">
          <p>{currentPost.description}</p>
        </div>
      </div>

      <div class="flex justify-center w-full">
        {#if currentPost.photo}
          <img src={currentPost.photo} alt="Post" />
        {/if}
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
              style={myLike ? 'color: #2078f4' : 'color: #718096'} />
            <p style={myLike ? 'color: #2078f4' : 'color: #718096'} class="p-1">
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
              <form
                class="commentForm flex items-center justify-center"
                on:submit={e => onAddComment(e)}>
                <IconThumbnail photoUrl={$profile.photo} width="2.5rem" />
                <input
                  id="commentInput"
                  bind:this={commentInput}
                  class="ml-2 rounded-full bg-gray-200 p-2"
                  placeholder="Write a comment..."
                  type="text" />
              </form>
              <div class="commentList">
                {#if openComments}
                  {#each post.comments as comment}
                    <Comment
                      {comment}
                      postId={post.id}
                      onDeleteComment={data => deleteComment(data)} />
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
{/if}
