export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'body' : IDL.Text,
    'author' : UserId,
    'timestamp' : IDL.Nat,
  });
  return IDL.Service({
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
    'submitPost' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
