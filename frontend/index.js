import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as backend_idl, canisterId as backend_canister_id } from "declarations/backend";

let backend;
let authClient;
let userPrincipal = null;

document.getElementById("loginButton").addEventListener("click", async () => {
  document.getElementById("loginButton").disabled = true;
  document.getElementById("loginButton").innerText = "Logging in...";

  authClient = await AuthClient.create();
  await authClient.login({
    identityProvider: "https://identity.ic0.app",
    onSuccess: async () => {
      initBackendActor();
      userPrincipal = authClient.getIdentity().getPrincipal().toText();
      document.getElementById("loginButton").innerText = "Logged in";
      document.getElementById("loginButton").disabled = true;
    },
  });
});

function initBackendActor() {
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  backend = Actor.createActor(backend_idl, {
    agent,
    canisterId: backend_canister_id,
  });
  loadPosts();
}

document.getElementById("newPostButton").addEventListener("click", () => {
  document.getElementById("postForm").classList.toggle("hidden");
});

// Initialize Quill editor
const quill = new Quill('#editor', {
  theme: 'snow'
});

document.getElementById("submitPostButton").addEventListener("click", async () => {
  const titleInput = document.getElementById("postTitle");
  const bodyContent = quill.root.innerHTML;

  document.getElementById("submitPostButton").disabled = true;
  document.getElementById("submitPostButton").innerText = "Submitting...";

  await backend.submitPost(titleInput.value, bodyContent);

  document.getElementById("submitPostButton").innerText = "Submit";
  document.getElementById("submitPostButton").disabled = false;
  document.getElementById("postForm").classList.add("hidden");
  titleInput.value = "";
  quill.root.innerHTML = "";
  loadPosts();
});

async function loadPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  const posts = await backend.getPosts();

  posts.forEach(post => {
    const postElement = document.createElement("div");
    postElement.className = "post";

    const titleElement = document.createElement("h2");
    titleElement.innerText = post.title;

    const authorElement = document.createElement("p");
    authorElement.className = "author";
    authorElement.innerText = `By ${post.author}`;

    const bodyElement = document.createElement("div");
    bodyElement.className = "body";
    bodyElement.innerHTML = post.body;

    postElement.appendChild(titleElement);
    postElement.appendChild(authorElement);
    postElement.appendChild(bodyElement);

    postsDiv.appendChild(postElement);
  });
}
