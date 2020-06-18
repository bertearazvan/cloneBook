<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  import CommentReply from "./CommentReply.svelte";
  import EditDots from "./EditDots.svelte";
  export let comment;
  export let postId;
  export let onDeleteComment;
  import { profile } from "./../store.js";

  $: currentPost = $profile.posts.filter(post => post.id === postId);
  $: currentComment = currentPost[0].comments.filter(
    item => item.id === comment.id
  )[0];

  let commentBody;
  let commentBeforeEdit;
  let replyInput;
  let like = false;
  let openForm = false;
  // let openEdit = false;
  // let openOptions = false;
  let editingComent = false;
  // let openDelete = false;
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

  const onSaveEditComment = () => {
    console.log("Save");
    currentComment.comment_body = commentBody.innerText;

    editingComent = false;
    commentBody.style.marginTop = "";
    commentBody.style.outline = "";
    commentBody.style.padding = "";
  };

  const onCancelEditComment = () => {
    console.log("cancel");
    commentBody.innerText = commentBeforeEdit;
    editingComent = false;
    commentBody.style.marginTop = "";
    commentBody.style.outline = "";
    commentBody.style.padding = "";
  };

  const onChangeComment = () => {
    editingComent = true;
    commentBeforeEdit = commentBody.innerText;
    setTimeout(() => {
      commentBody.focus();
      commentBody.style.marginTop = ".3rem";
      commentBody.style.outline = "0.1rem solid gray";
      commentBody.style.padding = ".4rem .6rem";
    }, 200);
  };

  $: deleteReply = id => {
    console.log(id);

    currentComment.replies = currentComment.replies.filter(
      reply => reply.id !== id
    );

    comment.replies = comment.replies.filter(reply => reply.id !== id);

    console.log(currentComment.replies);
  };

  const onOpenForm = data => {
    console.log(data);

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
    setTimeout(() => {
      if (replyInput) {
        replyInput.focus();
      }
    }, 200);
  };

  const onAddReply = e => {
    e.preventDefault();
    let newReply = {
      id: currentComment.replies.length + 1,
      comment_body: replyInput.value,
      likes: [],
      post_id: currentPost.id,
      replies: [],
      timestamp: "now",
      user: $profile.public_json
    };
    replyInput.value = "";
    // post.comments = [newComment, ...post.comments];
    // console.log(commentInput.value);
    currentComment.replies = [...currentComment.replies, newReply];
    currentComment.replies = currentComment.replies;
    // console.log(currentPost.comments);
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

  .commentBox {
    min-width: 500px;
  }

  .editCommentActions {
    cursor: pointer;
  }
</style>

<div class="commentItem flex justify-center m-2 mb-4">
  <IconThumbnail width="2.5rem" photoUrl={comment.user.photo} />
  <div>
    <div class="relative flex">
      <div class="commentBox relative bg-gray-200 rounded-lg px-4 py-2">
        <p class="font-large text-sm">
          {comment.user.firstName + ' ' + comment.user.lastName}
        </p>
        <p
          class="font-medium"
          bind:this={commentBody}
          contenteditable={editingComent}>
          {comment.comment_body}
        </p>

        <div class="flex text-sm">
          {#if editingComent}
            <p
              class="editCommentActions p-1"
              style="color: #718096"
              on:click={onSaveEditComment}>
              Save
            </p>
            <p
              class="editCommentActions p-1"
              style="color: #718096"
              on:click={onCancelEditComment}>
              Cancel
            </p>
          {/if}
        </div>
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
      <div>
        <EditDots
          onEdit={onChangeComment}
          onDelete={() => onDeleteComment(currentComment.id)}
          openEdit={currentComment.user.id === $profile.id ? true : false} />
      </div>

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
        onReplyForm={data => onOpenForm(data)}
        onDeleteReply={deleteReply} />
    {/each}
    {#if openForm}
      <div class="commentItemReply flex h-8 items-center justify-center m-2">
        <IconThumbnail width="2.5rem" photoUrl={$profile.photo} />
        <div class="w-full">
          <div class="relative rounded-lg p-2">

            <form on:submit={e => onAddReply(e)}>
              <input
                type="text"
                bind:this={replyInput}
                class="rounded-full bg-gray-200 p-2"
                placeholder={inputPlaceholder} />
            </form>

          </div>

        </div>
      </div>
    {/if}
  </div>

</div>
