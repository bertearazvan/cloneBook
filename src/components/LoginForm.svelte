<script>
  // ####
  import RegisterForm from "./RegisterForm.svelte";

  let page = "register";
  const onLogin = e => {
    e.preventDefault();
    console.log("Log in ");
  };

  const onChangeForm = data => {
    page = data;
  };
  console.log(page);
</script>

<style>

</style>

{#if page === 'login'}
  <div
    class="loginFormContainer max-w-md w-full mt-4 bg-white rounded-lg shadow
    p-4">
    <h2 class="ml-2 text-xl mb-2">Log in</h2>
    <form on:submit={onLogin}>
      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="text"
        placeholder="Email" />

      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="password"
        placeholder="Password" />
      <div class="relative">
        <span
          class="text-xs absolute right-0 text-gray-500 cursor-pointer
          hover:underline">
          Forgot password?
        </span>

      </div>
      <div class="grid mt-10 gap-1">
        <button
          type="submit"
          class="w-full bg-transparent hover:bg-blue-400 text-blue-500
          font-semibold hover:text-white py-1 px-4 border border-blue-400
          hover:border-transparent rounded">
          Log in
        </button>
        <div class="flex justify-center">
          <p class="text-xs text-gray-500">
            Not registered?
            <span
              class="cursor-pointer hover:underline"
              on:click={() => onChangeForm('register')}>
              Create an account!
            </span>
          </p>
        </div>

      </div>

    </form>
  </div>
{/if}

{#if page === 'register'}
  <RegisterForm onChangeForm={data => onChangeForm(data)} />
{/if}
