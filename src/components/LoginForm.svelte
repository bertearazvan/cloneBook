<script>
  // ####
  import { getRequest } from "./../utils/getRequest.js";
  import { postRequest } from "./../utils/postRequest.js";

  import RegisterForm from "./RegisterForm.svelte";

  import { profile } from "./../store.js";

  let page = "login";

  // const checkSession = async () => {
  //   let response = await getRequest("/users/session");
  //   if (response.type === "success") {
  //     location.href = `/`;
  //   }
  // };

  const onLogin = async e => {
    e.preventDefault();
    let data = new FormData(e.target);
    let response = await postRequest("/users/login", data);

    if (response.type === "success") {
      localStorage.setItem("token", response.token);
      $profile = response.user;
      $profile = $profile;

      location.href = `/`;
    }

    console.log(response);
    // console.log("Log in ");
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
    <form on:submit={e => onLogin(e)}>
      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="text"
        name="username"
        placeholder="Username" />

      <input
        class="rounded-lg bg-gray-200 m-1 p-2"
        type="password"
        name="password"
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
