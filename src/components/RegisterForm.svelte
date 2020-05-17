<script>
  // ###
  export let onChangeForm;

  const onRegister = e => {
    e.preventDefault();
    console.log("Register ");
  };
</script>

<style>
  /* ### */
</style>

<div
  class="loginFormContainer max-w-md w-full mt-4 bg-white rounded-lg shadow p-4">
  <h2 class="ml-2 text-xl mb-2">Register</h2>
  <form on:submit={onRegister}>
    <div class="grid grid-cols-2 gap-2">
      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="text"
        placeholder="First name" />
      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="text"
        placeholder="Last name" />
    </div>
    <input
      class="rounded-lg bg-gray-200 m-1 p-2"
      type="text"
      placeholder="Email" />
    <div class="grid grid-cols-2 gap-2">
      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="password"
        placeholder="Password" />
      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="password"
        placeholder="Repeat passsword" />
    </div>

    <div class="grid mt-10 gap-1">
      <button
        type="submit"
        class="w-full bg-transparent hover:bg-blue-400 text-blue-500
        font-semibold hover:text-white py-1 px-4 border border-blue-400
        hover:border-transparent rounded">
        Sign up
      </button>
      <div class="flex justify-center">
        <p class="text-xs text-gray-500">
          Already have an account?
          <span
            class="cursor-pointer hover:underline"
            on:click={() => onChangeForm('login')}>
            Log in!
          </span>
        </p>
      </div>

    </div>

  </form>
</div>
