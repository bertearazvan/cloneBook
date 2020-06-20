<script>
  import IconThumbnail from "./IconThumbnail.svelte";
  import EditDots from "./EditDots.svelte";
  export let reply;
  export let postId;
  export let commentId;
  export let onReplyForm;
  export let onDeleteReply;

  import { getRequest } from "./../utils/getRequest.js";
  import { postRequest } from "./../utils/postRequest.js";

  import { profile, storePosts } from "./../store.js";

  import { onMount } from "svelte";

  $: currentPost = $storePosts.filter(post => post._id === postId);
  $: currentComment =
    currentPost[0] &&
    currentPost[0].comments.filter(comment => comment._id === commentId);
  $: currentReply =
    currentComment[0] &&
    currentComment[0].replies.filter(item => item._id === reply._id)[0];

  let replyBody;

  let replyBeforeEdit;
  let like = false;
  let editingReply = false;

  $: myLike =
    currentReply && currentReply.likes.find(item => item.id === $profile._id);
  $: if (myLike) {
    like = true;
  }

  onMount(() => {
    console.log(currentReply);
    setInterval(() => {
      checkReplyLikes();
    }, 3000);
  });

  const checkReplyLikes = async () => {
    let response = await getRequest("/replies/likes", {
      userId: currentPost[0].user.id,
      postId: currentPost[0]._id,
      commentId: currentComment[0]._id,
      replyId: currentReply._id
    });

    if (response.likes.length !== currentReply.likes.length) {
      // console.log(response);
      currentReply.likes = response.likes;
    }
  };

  const onSaveEditReply = async () => {
    console.log("Save");

    let response = await getRequest("/replies/update", {
      userId: currentPost[0].user.id,
      postId: currentPost[0]._id,
      commentId: currentComment[0]._id,
      replyId: currentReply._id,
      replyBody: replyBody.innerText
    });
    console.log(response);

    if (response.type === "success") {
      currentReply.comment_body = replyBody.innerText;

      editingReply = false;
      replyBody.style.marginTop = "";
      replyBody.style.outline = "";
      replyBody.style.padding = "";
    }
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

  const onLikeReply = async () => {
    let form = new FormData();

    form.append("userId", currentPost[0].user.id);
    form.append("postId", currentPost[0]._id);
    form.append("commentId", currentComment[0]._id);
    form.append("replyId", currentReply._id);
    let response = await postRequest("/replies/likes", form);

    console.log("myLike", myLike);

    if (response.type === "success") {
      if (myLike === undefined) {
        currentReply.likes = [...currentReply.likes, $profile.public_json];
        like = true;
      } else {
        currentReply.likes = currentReply.likes.filter(
          currentLike => currentLike.id != $profile._id
        );
        like = false;
      }
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
{#if currentReply}
  <div class="commentItemReply grid m-2">
    <IconThumbnail width="2rem" photoUrl={currentReply.user.photo} />
    <div>
      <div class="relative flex">
        <div class="commentBox relative bg-gray-200 rounded-lg p-2">
          <p class="font-large text-sm">
            {currentReply.user.firstName + ' ' + currentReply.user.lastName}
          </p>
          <p
            class="font-medium"
            bind:this={replyBody}
            contenteditable={editingReply}>
            {currentReply.comment_body}
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
            onDelete={() => onDeleteReply(currentReply._id)}
            openEdit={currentReply.user.id === $profile._id ? true : false} />
        </div>
      </div>
      <div class="text-sm ml-3 text-gray-600">
        <p>
          <span
            style={like ? 'color: #2078f4' : 'color: #718096'}
            class="commentReply cursor-pointer"
            on:click={() => onLikeReply(currentReply)}>
            Like
          </span>
          ·
          <span
            class="commentReply cursor-pointer"
            on:click={onReplyForm(currentReply)}>
            Reply
          </span>
          ·
          <span class="font-medium">1d</span>
        </p>
      </div>

    </div>
  </div>
{/if}
