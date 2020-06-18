<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  import EditDots from "./EditDots.svelte";
  export let reply;
  export let postId;
  export let commentId;
  export let onReplyForm;
  export let onDeleteReply;
  import { profile } from "./../store.js";

  $: currentPost = $profile.posts.filter(post => post.id === postId);
  $: currentComment = currentPost[0].comments.filter(
    comment => comment.id === commentId
  );
  $: currentReply = currentComment[0].replies.filter(
    item => item.id === reply.id
  )[0];

  let replyBody;

  let replyBeforeEdit;
  let like = false;
  let editingReply = false;

  let myLike = reply.likes.find(item => item.id === $profile.id);
  if (myLike) {
    like = true;
  }

  const onSaveEditReply = () => {
    console.log("Save");
    currentReply.comment_body = replyBody.innerText;

    editingReply = false;
    replyBody.style.marginTop = "";
    replyBody.style.outline = "";
    replyBody.style.padding = "";
  };

  const onCancelEditReply = () => {
    console.log("cancel");
    replyBody.innerText = replyBeforeEdit;
    editingReply = false;
    replyBody.style.marginTop = "";
    replyBody.style.outline = "";
    replyBody.style.padding = "";
  };

  const onChangeReply = () => {
    editingReply = true;
    replyBeforeEdit = replyBody.innerText;
    setTimeout(() => {
      replyBody.focus();
      replyBody.style.marginTop = ".3rem";
      replyBody.style.outline = "0.1rem solid gray";
      replyBody.style.padding = ".4rem .6rem";
    }, 200);
  };

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

  .commentBox {
    min-width: 400px;
  }

  .editCommentActions {
    cursor: pointer;
  }
</style>

<!-- <Comment comment={reply} /> -->
<div class="commentItemReply grid m-2">
  <IconThumbnail width="2rem" photoUrl={reply.user.photo} />
  <div>
    <div class="relative flex">
      <div class="commentBox relative bg-gray-200 rounded-lg p-2">
        <p class="font-large text-sm">
          {reply.user.firstName + ' ' + reply.user.lastName}
        </p>
        <p
          class="font-medium"
          bind:this={replyBody}
          contenteditable={editingReply}>
          {reply.comment_body}
        </p>
        <div class="flex text-sm">
          {#if editingReply}
            <p
              class="editCommentActions p-1"
              style="color: #718096"
              on:click={onSaveEditReply}>
              Save
            </p>
            <p
              class="editCommentActions p-1"
              style="color: #718096"
              on:click={onCancelEditReply}>
              Cancel
            </p>
          {/if}
        </div>
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
      <div>
        <EditDots
          onEdit={onChangeReply}
          onDelete={() => onDeleteReply(currentReply.id)}
          openEdit={currentReply.user.id === $profile.id ? true : false} />
      </div>
    </div>
    <div class="text-sm ml-3 text-gray-600">
      <p>
        <span
          style={like ? 'color: #2078f4' : 'color: #718096'}
          class="commentReply cursor-pointer"
          on:click={() => onLikeReply(reply)}>
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
