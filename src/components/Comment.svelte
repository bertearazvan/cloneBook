<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  import CommentReply from "./CommentReply.svelte";
  export let comment;
  export let postId;
  import { profile } from "./../store.js";

  $: currentPost = $profile.posts.filter(post => post.id === postId);
  $: currentComment = currentPost[0].comments.filter(
    item => item.id === comment.id
  )[0];

  let like = false;
  let openForm = false;
  let inputPlaceholder = "Write a reply...";

  let myLike = comment.likes.find(item => item.id === $profile.id);

  if (myLike) {
    like = true;
  }

  const onLikeComment = e => {
    let myLike = currentComment.likes.find(item => item.id === $profile.id);
    if (myLike === undefined) {
      currentComment.likes = [...currentComment.likes, $profile.public_json];
      like = true;
    } else {
      currentComment.likes = currentComment.likes.filter(
        currentLike => currentLike.id != $profile.id
      );
      like = false;
    }
  };

  let beforeData = {
    comment_body: "",
    user: {
      id: 0
    },
    timestamp: 0
  };

  const onOpenForm = data => {
    console.log(data.comment_body, currentComment.comment_body);
    inputPlaceholder = `Reply to ${data.user.firstName +
      " " +
      data.user.lastName}`;
    if (
      data.comment_body === beforeData.comment_body &&
      data.user.id === beforeData.user.id &&
      data.timestamp === beforeData.timestamp
    ) {
      openForm = !openForm;
    } else {
      openForm = true;
    }

    beforeData = data;
  };
</script>

<style>
  .commentItem {
    grid-template-columns: 6fr 85fr;
  }

  .commentLike:hover {
    text-decoration: underline;
  }
  .commentLike {
    cursor: pointer;
  }

  .likeCounterComment {
    right: 0.5rem;
    bottom: -0.5rem;
  }
</style>

<div class="commentItem flex justify-center m-2 mb-4">
  <IconThumbnail width="2.5rem" photoUrl={comment.user.photo} />
  <div>
    <div class="relative bg-gray-200 rounded-lg p-2">
      <p class="font-large text-sm">
        {comment.user.firstName + ' ' + comment.user.lastName}
      </p>
      <p class="font-medium">{comment.comment_body}</p>
      {#if currentComment.likes.length > 0}
        <div
          class="likeCounterComment absolute bg-white shadow w-auto h-6
          rounded-full grid grid-cols-2 p-1">
          <div class="flex items-center justify-center">
            <img class="w-4" src="/images/like.svg" alt="like" />
          </div>

          <div class="flex items-center justify-center">
            <p class="text-xs text-gray-700 font-medium">
              {currentComment.likes.length}
            </p>
          </div>

        </div>
      {/if}
    </div>

    <div class="text-sm ml-3 text-gray-600">
      <p>
        <span
          style={like ? 'color: #2078f4' : 'color: #718096'}
          class="commentLike cursor-pointer"
          on:click={onLikeComment}>
          Like
        </span>
        ·
        <span
          class="commentReply cursor-pointer"
          on:click={onOpenForm(comment)}>
          Reply
        </span>
        ·
        <span class="font-medium">{comment.timestamp}</span>
      </p>
    </div>
    {#each comment.replies as reply}
      <CommentReply
        {reply}
        {postId}
        commentId={comment.id}
        onReplyForm={data => onOpenForm(data)} />
    {/each}
    {#if openForm}
      <div class="commentItemReply flex h-8 items-center justify-center m-2">
        <IconThumbnail width="2.5rem" photoUrl={$profile.photo} />
        <div class="w-full">
          <div class="relative rounded-lg p-2">

            <form>
              <input
                type="text"
                class="rounded-full bg-gray-200 p-2"
                placeholder={inputPlaceholder} />
            </form>

          </div>

        </div>
      </div>
    {/if}
  </div>

</div>
