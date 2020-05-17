<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  export let reply;
  export let postId;
  export let commentId;
  export let onReplyForm;
  import { profile } from "./../store.js";

  $: currentPost = $profile.posts.filter(post => post.id === postId);
  $: currentComment = currentPost[0].comments.filter(
    comment => comment.id === commentId
  );
  $: currentReply = currentComment[0].replies.filter(
    item => item.id === reply.id
  )[0];

  let like = false;
  let myLike = reply.likes.find(item => item.id === $profile.id);
  if (myLike) {
    like = true;
  }

  const onLikeReply = () => {
    let myLike = currentReply.likes.find(item => item.id === $profile.id);
    if (myLike === undefined) {
      currentReply.likes = [...currentReply.likes, $profile.public_json];
      like = true;
    } else {
      currentReply.likes = currentReply.likes.filter(
        currentLike => currentLike.id != $profile.id
      );
      like = false;
    }
    // console.log(currentReply);
  };
</script>

<style>
  .commentItemReply {
    grid-template-columns: 6fr 85fr;
  }

  .commentReply:hover {
    text-decoration: underline;
  }
  .commentReply {
    cursor: pointer;
  }

  .likeCounterComment {
    right: 0.5rem;
    bottom: -0.5rem;
  }
</style>

<!-- <Comment comment={reply} /> -->
<div class="commentItemReply grid m-2">
  <IconThumbnail width="2rem" photoUrl={reply.user.photo} />
  <div>
    <div class="relative bg-gray-200 rounded-lg p-2">
      <p class="font-large text-sm">
        {reply.user.firstName + ' ' + reply.user.lastName}
      </p>
      <p class="font-medium">{reply.comment_body}</p>
      {#if currentReply.likes.length > 0}
        <div
          class="likeCounterComment absolute bg-white shadow w-auto h-6
          rounded-full grid grid-cols-2 p-1">
          <div class="flex items-center justify-center">
            <img class="w-4" src="/images/like.svg" alt="like" />
          </div>

          <div class="flex items-center justify-center">
            <p class="text-xs text-gray-700 font-medium">
              {currentReply.likes.length}
            </p>
          </div>
        </div>
      {/if}
    </div>
    <div class="text-sm ml-3 text-gray-600">
      <p>
        <span
          style={like ? 'color: #2078f4' : 'color: #718096'}
          class="commentReply cursor-pointer"
          on:click={onLikeReply(reply)}>
          Like
        </span>
        ·
        <span class="commentReply cursor-pointer" on:click={onReplyForm(reply)}>
          Reply
        </span>
        ·
        <span class="font-medium">1d</span>
      </p>
    </div>

  </div>
</div>
