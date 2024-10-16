import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Int "mo:base/Int";
import Time "mo:base/Time";

import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

actor {

  // Importing the types for Internet Identity
  type UserId = Principal;

  // Post structure
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: UserId;
    timestamp: Nat;
  };

  // Stable variable to store posts
  stable var posts: [Post] = [];

  // Function to submit a new post
  public shared({caller}) func submitPost(title: Text, body: Text) : async Bool {
    let newPost: Post = {
      id = Nat.fromInt(posts.size() + 1);
      title = title;
      body = body;
      author = caller;
      timestamp = Int.abs(Time.now());
    };
    posts := Array.append<Post>([newPost], posts);
    return true;
  };

  // Function to get all posts
  public query func getPosts() : async [Post] {
    return posts;
  };

}
