import React from 'react';

const Posts = (props) => {
  const { posts } = props;
  if (!posts || posts.length === 0) return <p>Can not find any posts, Sorry!</p>;

  return (
    <section>
      {posts.map((post) => (
        <p key={post.id}>{post.content}</p>
      ))}
    </section>
  );
};

export default Posts;