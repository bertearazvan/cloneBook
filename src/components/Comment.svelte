<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  import CommentReply from "./CommentReply.svelte";
  import EditDots from "./EditDots.svelte";
  export let comment;
  export let postId;
  export let onDeleteComment;

  import { profile, storePosts } from "./../store.js";

  import { getRequest } from "./../utils/getRequest.js";
  import { postRequest } from "./../utils/postRequest.js";
  import { onMount } from "svelte";

  $: currentPost = $storePosts.filter(post => post._id === postId);
  $: currentComment =
    currentPost[0] &&
    currentPost[0].comments.filter(item => item._id === comment._id)[0];

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

  $: myLike =
    currentComment &&
    currentComment.likes.find(item => item.id === $profile._id);
  $: if (myLike) {
    like = true;
  }

  onMount(() => {
    like = false;
    setInterval(() => {
      checkCommentLikes();
    }, 15000);
  });

  const checkCommentLikes = async () => {
    let response = await getRequest("/comments/likes", {
      userId: currentPost[0].user.id,
      postId: currentPost[0]._id,
      commentId: currentComment._id
    });

    if (response.likes.length !== currentComment.likes.length) {
      // console.log(response);
      currentComment.likes = response.likes;
    }
  };

  const onLikeComment = async e => {
    let response = await getRequest("/comments/addLike", {
      postId: currentPost[0]._id,
      commentId: currentComment._id,
      userId: currentPost[0].user.id
    });

    if (response.type === "success") {
      // console.log(myLike);

      if (myLike === undefined) {
        currentComment.likes = [...currentComment.likes, $profile.public_json];
        like = true;
      } else {
        currentComment.likes = currentComment.likes.filter(
          currentLike => currentLike.id != $profile._id
        );
        like = false;
      }
    }
  };

  let beforeData = {
    comment_body: "",
    user: {
      id: 0
    },
    timestamp: 0
  };

  const onSaveEditComment = async () => {
    console.log("Save");
    let response = await getRequest("/comments/update", {
      commentId: currentComment._id,
      postId: postId,
      userId: currentPost[0].user.id,
      commentBody: commentBody.innerText
    });

    if (response.type === "success") {
      currentComment.comment_body = commentBody.innerText;

      editingComent = false;
      commentBody.style.marginTop = "";
      commentBody.style.outline = "";
      commentBody.style.padding = "";
    }
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

  $: deleteReply = async id => {
    // console.log(id);

    let response = await getRequest("/replies/delete", {
      userId: currentPost[0].user.id,
      postId: currentPost[0]._id,
      commentId: currentComment._id,
      replyId: id
    });

    console.log(response);

    if (response.type === "success") {
      currentComment.replies = currentComment.replies.filter(
        reply => reply._id !== id
      );
    }

    // comment.replies = comment.replies.filter(reply => reply._id !== id);

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

  const onAddReply = async e => {
    e.preventDefault();

    let form = new FormData();
    form.append("userId", currentPost[0].user.id);
    form.append("postId", currentPost[0]._id);
    form.append("commentId", currentComment._id);
    form.append("commentBody", replyInput.value);

    let response = await postRequest("/replies", form);
    console.log(response);

    if (response.type === "success") {
      replyInput.value = "";
      currentComment.replies = [...currentComment.replies, response.reply];
    }
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
    min-width: 90%;
  }

  .editCommentActions {
    cursor: pointer;
  }
</style>

{#if currentComment}
  <div class="commentItem flex justify-start m-2 mb-4">
    <div
      class="cursor-pointer"
      on:click={() => (window.location.href = `profile/${currentComment.user.username}`)}>
      <IconThumbnail width="2.5rem" photoUrl={currentComment.user.photo} />
    </div>

    <div>
      <div class="relative flex flex-start">
        <div class="commentBox relative bg-gray-200 rounded-lg px-4 py-2">
          <p class="font-large text-sm">
            {currentComment.user.firstName + ' ' + currentComment.user.lastName}
          </p>
          <p
            class="font-medium"
            bind:this={commentBody}
            contenteditable={editingComent}>
            {currentComment.comment_body}
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
            onDelete={() => onDeleteComment(currentComment._id)}
            openEdit={currentComment.user.id === $profile._id ? true : false} />
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
            on:click={onOpenForm(currentComment)}>
            Reply
          </span>
          ·
          <span class="font-medium">{currentComment.timestamp}</span>
        </p>
      </div>
      {#each currentComment.replies as reply}
        <CommentReply
          {reply}
          {postId}
          commentId={currentComment._id}
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
{/if}
